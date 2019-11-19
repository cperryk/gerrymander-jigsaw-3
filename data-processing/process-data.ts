import { read } from "shapefile";
import { join } from "path";

import { FeatureCollection } from "geojson";
import { outputJson } from "fs-extra";

import SVGO from "svgo";

const geojsonToSvg = require("geojson-to-svg");

const OUT_DIR = join(__dirname, "..", "dist", "svg");
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

async function toSvgHash(
  featureCollection: FeatureCollection
): Promise<{ [key: string]: string }> {
  const prev = {};
  for (const curr of featureCollection.features) {
    const district = curr.properties.DISTRICT;
    const state = curr.properties.STATE;
    const svg = await geojsonToSvg()
      .data(curr)
      .render();
    const optimized = await optimize(svg);
    prev[`${state}-${district}`] = optimized;
  }
  return prev;
}

async function optimize(svg: string) {
  const svgo = new SVGO();
  return (await svgo.optimize(svg)).data;
}

async function go(inFile: string, inDataFile: string, outFile: string) {
  const featureCollection = await readShapefile(inFile, inDataFile);
  const svgHash = await toSvgHash(featureCollection);
  console.log(svgHash);
  await outputJson(outFile, svgHash);
  console.log(`written: ${outFile}`);
}

const inFile = join(INPUT_DIR, "AL-current.shp");
const inDataFile = join(INPUT_DIR, "AL-current.dbf");
const outFile = join(OUT_DIR, "al.json");

go(inFile, inDataFile, outFile).catch(err => {
  console.error(err);
  process.exit(1);
});
