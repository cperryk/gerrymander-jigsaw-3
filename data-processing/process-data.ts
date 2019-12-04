import { read } from "shapefile";
import { join } from "path";

import { FeatureCollection, Feature } from "geojson";
import { outputJson, outputFile } from "fs-extra";
import xml2js from "xml2js";

import SVGO from "svgo";
import { scaleLinear } from "d3";

const geojsonToSvg = require("geojson-to-svg");

const OUT_DIR = join(__dirname, "..", "src", "districts");
const INPUT_DIR = join(
  __dirname,
  "..",
  "..",
  "redistricting-atlas-data",
  "shp"
);

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

async function toSvgHash(
  featureCollection: FeatureCollection
): Promise<{ [key: string]: string[] }> {
  const prev = {};

  const [minX, minY, maxX, maxY] = featureCollection.bbox;
  const mapRange = Math.max(maxX - minX, maxY - minY);

  const xScale = scaleLinear()
    .domain([minX, minX + mapRange])
    .range([0, 1000]);

  const yScale = scaleLinear()
    .domain([minY, minY + mapRange])
    .range([0, 1000]);

  const mirrorY = mirror(minY, maxY);

  for (const curr of featureCollection.features) {
    const district = curr.properties.DISTRICT;
    const state = curr.properties.STATE;
    const svg = await geojsonToSvg()
      .projection(([x, y]) => {
        return [Math.trunc(xScale(x)), Math.trunc(yScale(mirrorY(y)))];
      })
      .data(curr)
      .render();

    const optimized = await optimize(svg);
    const paths = await extractPaths(optimized);
    prev[`${state}-${district}`] = paths;
  }
  return prev;
}

function toSvg(svgHash, viewBox: [number, number, number, number]): string {
  const pathEls = Object.values(svgHash)
    .map(path => `<path d="${path}"/>`)
    .join("\n");
  return `<svg viewBox="${viewBox.join(
    " "
  )}" xmlns="http://www.w3.org/2000/svg" version="1.2">${pathEls}</svg>`;
}

async function go(inFile: string, inDataFile: string, outFile: string) {
  const featureCollection = await readShapefile(inFile, inDataFile);
  const svgHash = await toSvgHash(featureCollection);
  await outputJson(outFile, svgHash);
  outputFile("test.svg", toSvg(svgHash, [0, 0, 1000, 1000]));
}

const inFile = join(INPUT_DIR, "AL-current.shp");
const inDataFile = join(INPUT_DIR, "AL-current.dbf");
const outFile = join(OUT_DIR, "al.json");

go(inFile, inDataFile, outFile).catch(err => {
  console.error(err);
  process.exit(1);
});
