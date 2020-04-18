import { scaleLinear, ScaleLinear } from "d3";
import { FeatureCollection } from "geojson";
import { cloneDeep } from "lodash";
import sizeof from "object-sizeof";
import { feature } from "topojson-client";
import { topology } from "topojson-server";
import { presimplify, simplify } from "topojson-simplify";
import traverse from "traverse";
import { Conf } from "./conf";
import { bytesToKilobytes } from "./utilities";

export default function simplifyGeojson(
  geojson: FeatureCollection,
  conf: Conf
): FeatureCollection {
  return simplifyUntil(geojson, 50);
}

function simplifyUntil(
  geojson: FeatureCollection,
  maxKilobytes: number
): FeatureCollection {
  let simplificationFactor = 0.0001;
  let out;
  let lastSize;
  while (lastSize === undefined || lastSize > maxKilobytes) {
    geojson = simplifyGeometries(geojson, simplificationFactor);
    out = recast(geojson as any);
    lastSize = bytesToKilobytes(sizeof(out));
    console.log(
      `With simplification factor ${simplificationFactor}, geojson size is ${lastSize} kb`
    );
    simplificationFactor *= 2;
  }
  return out;
}

function simplifyGeometries(
  geojson: FeatureCollection,
  simplificationFactor: number
): FeatureCollection {
  let out = geojson;
  let topo = topology({ foo: out });
  topo = presimplify(topo);
  topo = simplify(topo, simplificationFactor);
  const simplifiedGeojson = feature(topo, "foo" as any);
  simplifiedGeojson.bbox = geojson.bbox;
  return simplifiedGeojson as any;
}

function recast(featureCollection: GeoJSON.FeatureCollection) {
  const out = cloneDeep(featureCollection);
  const { minX, minY, maxX, maxY } = deepFindCoordinateBounds(out);
  deepSubtractCoordinate(out, minX, minY);
  const scale = scaleLinear()
    .domain([0, Math.max(maxX - minX, maxY - minY)])
    .range([0, 1000]);
  deepScaleCoordinate(out, scale, scale);
  deepTruncateCoordinate(out);
  return out;
}

function isCoordinate(x: any): x is [number, number] {
  return (
    Array.isArray(x) &&
    x.length === 2 &&
    typeof x[0] === "number" &&
    typeof x[1] === "number"
  );
}

function isBbox(x: any): x is [number, number, number, number] {
  return (
    Array.isArray(x) && x.length === 4 && x.every(i => typeof i === "number")
  );
}

function deepTruncateCoordinate<T extends object>(obj: T) {
  return traverse(obj).forEach(function(x) {
    if (isCoordinate(x)) {
      this.update([Math.trunc(x[0]), Math.trunc(x[1])]);
    } else if (isBbox(x)) {
      this.update([
        Math.trunc(x[0]),
        Math.trunc(x[1]),
        Math.trunc(x[2]),
        Math.trunc(x[3])
      ]);
    }
  });
}

function deepScaleCoordinate<T extends object>(
  obj: T,
  scaleX: ScaleLinear<number, number>,
  scaleY: ScaleLinear<number, number>
): T {
  return traverse(obj).forEach(function(x) {
    if (isCoordinate(x)) {
      this.update([scaleX(x[0]), scaleY(x[1])]);
    }
    if (isBbox(x)) {
      this.update([scaleX(x[0]), scaleY(x[1]), scaleX(x[2]), scaleY(x[3])]);
    }
  });
}

function deepSubtractCoordinate<T extends object>(
  obj: T,
  subtractX,
  subtractY
): T {
  return traverse(obj).forEach(function(x) {
    if (isCoordinate(x)) {
      this.update([x[0] - subtractX, x[1] - subtractY]);
    } else if (isBbox(x)) {
      this.update([
        x[0] - subtractX,
        x[1] - subtractY,
        x[2] - subtractX,
        x[3] - subtractY
      ]);
    }
  });
}

function deepFindCoordinateBounds(
  obj: object
): { minX: number; minY: number; maxX: number; maxY: number } {
  return traverse(obj).reduce(
    function(acc, i) {
      if (isCoordinate(i)) {
        const [x, y] = i;
        if (x < acc.minX) {
          acc.minX = x;
        }
        if (y < acc.minY) {
          acc.minY = y;
        }
        if (x > acc.maxX) {
          acc.maxX = x;
        }
        if (y > acc.maxY) {
          acc.maxY = y;
        }
      }
      return acc;
    },
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    }
  );
}
