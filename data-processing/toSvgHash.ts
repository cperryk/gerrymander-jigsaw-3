import { FeatureCollection } from "geojson";
import { scaleLinear } from "d3";
const geojsonToSvg = require("geojson-to-svg");
import {
  BOUNDING_BOX,
  GUTTER,
  applyProjections,
  mirrorY,
  scalePosition,
  truncatePosition,
  offsetX,
  optimize,
  extractPaths
} from "./process-data";
export async function toSvgHash(
  featureCollection: FeatureCollection
): Promise<{
  [key: string]: string[];
}> {
  const prev = {};
  const [minX, minY, maxX, maxY] = featureCollection.bbox;
  const mapRange = Math.max(maxX - minX, maxY - minY);
  const xScale = scaleLinear()
    .domain([minX, minX + mapRange])
    .range([BOUNDING_BOX.startX + GUTTER, BOUNDING_BOX.width - GUTTER]);
  const yScale = scaleLinear()
    .domain([minY, minY + mapRange])
    .range([BOUNDING_BOX.startY + GUTTER, BOUNDING_BOX.height - GUTTER]);
  const horizontalCenteringOffset =
    (BOUNDING_BOX.width - GUTTER * 2 - (xScale(maxX) - xScale(minX))) / 2;
  for (const curr of featureCollection.features) {
    const district = curr.properties.DISTRICT;
    const state = curr.properties.STATE;
    const svg = await geojsonToSvg()
      .projection(
        applyProjections(
          mirrorY(minY, maxY),
          scalePosition(xScale, yScale),
          truncatePosition(),
          offsetX(horizontalCenteringOffset)
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
