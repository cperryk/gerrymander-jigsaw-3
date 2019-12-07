import { join } from "path";

import { FeatureCollection } from "geojson";
import { outputJson, readJsonSync, statSync, writeFileSync } from "fs-extra";
import xml2js from "xml2js";
import { Conf } from "./conf";
import minimist from "minimist";

import SVGO from "svgo";
import { scaleLinear, ScaleLinear } from "d3";
import simplifyGeojson from "./simplify";

const geojsonToSvg = require("geojson-to-svg");

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
  console.log(featureCollection);
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
  console.log(conf);
  let geojson = await readJsonSync(conf.inFilePath);
  geojson = simplifyGeojson(geojson, conf);
  const svgHash = await toSvgHash(geojson, conf);
  writeJson(conf.outPath, svgHash);
}

async function writeJson(path: string, input: any) {
  await outputJson(conf.outPath, input);
  const { size } = statSync(path);
  const megabytes = size / 1000.0;
  console.log(`written: ${path} (${megabytes} kb}`);
}

const OUT_DIR = join(__dirname, "..", "src", "districts");
const INPUT_DIR = join(__dirname, "..", "geojsons");

const { _, ...argv } = minimist(process.argv);

const conf: Conf = {
  outPath: join(OUT_DIR, "al.json"),
  inFilePath: join(INPUT_DIR, "wv.geojson"),
  simplificationFactor: 0.0001,
  svgStartX: 0,
  svgStartY: 0,
  svgWidth: 1000,
  svgHeight: 1000,
  svgGutter: 100,
  ...argv
};

go(conf).catch(err => {
  console.error(err);
  process.exit(1);
});
