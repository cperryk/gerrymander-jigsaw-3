import { read } from "shapefile";
import { join } from "path";

import { FeatureCollection } from "geojson";
import { outputJson } from "fs-extra";
import xml2js from "xml2js";

import SVGO from "svgo";
import { scaleLinear, ScaleLinear } from "d3";
import reproject from "reproject";
import epsg from "epsg";
import simplifyGeojson from "./simplify";

const geojsonToSvg = require("geojson-to-svg");

const OUT_DIR = join(__dirname, "..", "src", "districts");
const INPUT_DIR = join(
  __dirname,
  "..",
  "..",
  "redistricting-atlas-data",
  "shp"
);

const PUZZLE = {
  startX: 0,
  startY: 0,
  width: 1000,
  height: 1000,
  gutter: 200
};

async function readShapefile(shapeFilePath: string, dbFilePath: string) {
  return read(shapeFilePath, dbFilePath);
}

async function extractPaths(svg: string): Promise<string[]> {
  const parsed = await xml2js.parseStringPromise(svg);
  const paths = parsed.svg.path.map(path => path.$.d);
  return paths;
}

async function optimize(svg: string) {
  const svgo = new SVGO({
    plugins: [
      {
        convertPathData: true
      },
      {
        cleanupNumericValues: {
          floatPrecision: 0
        }
      }
    ]
  });
  return (await svgo.optimize(svg)).data;
}

const mirror = (min: number, max: number) => {
  const midpoint = min + (max - min) / 2;
  return val =>
    val > midpoint ? midpoint - (val - midpoint) : midpoint + (midpoint - val);
};

type position = [number, number];
type projection = (position) => position;

function applyProjections(...fncs: projection[]): projection {
  return (a: position) => {
    return fncs.reduce((prev, fnc) => {
      return fnc(prev);
    }, a);
  };
}

function scalePosition(
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>
): projection {
  return ([x, y]) => {
    return [xScale(x), yScale(y)];
  };
}

function fitPuzzleBounds(featureCollection: FeatureCollection): projection {
  const [minX, minY, maxX, maxY] = featureCollection.bbox;
  const mapRange = Math.max(maxX - minX, maxY - minY);

  const xScale = scaleLinear()
    .domain([minX, minX + mapRange])
    .range([PUZZLE.startX + PUZZLE.gutter, PUZZLE.width - PUZZLE.gutter]);

  const yScale = scaleLinear()
    .domain([minY, minY + mapRange])
    .range([PUZZLE.startY + PUZZLE.gutter, PUZZLE.height - PUZZLE.gutter]);

  const horizontalCenteringOffset =
    (PUZZLE.width - PUZZLE.gutter * 2 - (xScale(maxX) - xScale(minX))) / 2;

  return applyProjections(
    scalePosition(xScale, yScale),
    offsetX(horizontalCenteringOffset)
  );
}

function offsetX(offset: number): projection {
  return ([x, y]) => {
    return [x + offset, y];
  };
}

function mirrorY(featureCollection: FeatureCollection): projection {
  const [minX, minY, maxX, maxY] = featureCollection.bbox;
  const mirrorFnc = mirror(minY, maxY);
  return ([x, y]) => [x, mirrorFnc(y)];
}

function filterFalsy(...projections: projection[]): projection {
  const next = applyProjections(...projections);
  return (a: position) => (a ? next(a) : null);
}

async function toSvgHash(
  featureCollection: FeatureCollection
): Promise<{ [key: string]: string[] }> {
  const prev = {};

  for (const curr of featureCollection.features) {
    const district = curr.properties.DISTRICT;
    const state = curr.properties.STATE;
    const svg = await geojsonToSvg()
      .projection(
        filterFalsy(
          mirrorY(featureCollection),
          fitPuzzleBounds(featureCollection)
        )
      )
      .data(curr)
      .render();

    const optimized = await optimize(svg);
    const paths = await extractPaths(optimized);
    prev[`${state}-${district}`] = paths;
  }
  return prev;
}

async function go(inFile: string, inDataFile: string, outFile: string) {
  let geojson = await readShapefile(inFile, inDataFile);
  geojson = reproject.reproject(geojson, "WGS84", "EPSG:3994", epsg);
  geojson = simplifyGeojson(geojson);
  const svgHash = await toSvgHash(geojson);
  await outputJson(outFile, svgHash);
}

const inFile = join(INPUT_DIR, "NY-current.shp");
const inDataFile = join(INPUT_DIR, "NY-current.dbf");
const outFile = join(OUT_DIR, "al.json");

go(inFile, inDataFile, outFile).catch(err => {
  console.error(err);
  process.exit(1);
});
