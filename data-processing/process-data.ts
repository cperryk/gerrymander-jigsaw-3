import { read } from "shapefile";
import { join } from "path";

import { FeatureCollection } from "geojson";
import { outputJson } from "fs-extra";
import xml2js from "xml2js";
import { Conf } from "./conf";

import SVGO from "svgo";
import { scaleLinear, ScaleLinear } from "d3";
import reproject from "reproject";
import epsg from "epsg";
import simplifyGeojson from "./simplify";

const geojsonToSvg = require("geojson-to-svg");

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

function fitPuzzleBounds(
  featureCollection: FeatureCollection,
  conf: Conf
): projection {
  const [minX, minY, maxX, maxY] = featureCollection.bbox;
  const mapRange = Math.max(maxX - minX, maxY - minY);

  const xScale = scaleLinear()
    .domain([minX, minX + mapRange])
    .range([conf.svgStartX + conf.svgGutter, conf.svgWidth - conf.svgGutter]);

  const yScale = scaleLinear()
    .domain([minY, minY + mapRange])
    .range([conf.svgStartY + conf.svgGutter, conf.svgHeight - conf.svgGutter]);

  const horizontalCenteringOffset =
    (conf.svgWidth - conf.svgGutter * 2 - (xScale(maxX) - xScale(minX))) / 2;

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
  featureCollection: FeatureCollection,
  conf: Conf
): Promise<{ [key: string]: string[] }> {
  const prev = {};

  for (const curr of featureCollection.features) {
    const district = curr.properties.DISTRICT;
    const state = curr.properties.STATE;
    const svg = await geojsonToSvg()
      .projection(
        filterFalsy(
          mirrorY(featureCollection),
          fitPuzzleBounds(featureCollection, conf)
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

async function go(conf: Conf) {
  let geojson = await readShapefile(conf.inShapeFilePath, conf.inDataFilePath);
  geojson = reproject.reproject(geojson, conf.inputCRS, conf.outputCRS, epsg);
  geojson = simplifyGeojson(geojson, conf);
  const svgHash = await toSvgHash(geojson, conf);
  await outputJson(conf.outPath, svgHash);
}

const OUT_DIR = join(__dirname, "..", "src", "districts");
const INPUT_DIR = join(
  __dirname,
  "..",
  "..",
  "redistricting-atlas-data",
  "shp"
);

const conf: Conf = {
  outPath: join(OUT_DIR, "al.json"),
  inShapeFilePath: join(INPUT_DIR, "NY-current.shp"),
  inDataFilePath: join(INPUT_DIR, "NY-current.dbf"),
  inputCRS: "WGS84",
  outputCRS: "EPSG:3994",
  simplificationFactor: 20000000,
  svgStartX: 0,
  svgStartY: 0,
  svgWidth: 1000,
  svgHeight: 1000,
  svgGutter: 100
};

go(conf).catch(err => {
  console.error(err);
  process.exit(1);
});
