import { topology } from "topojson-server";
import { GeoJsonObject, FeatureCollection, Feature } from "geojson";
import { simplify, presimplify } from "topojson-simplify";
import { feature } from "topojson-client";
import { inspect } from "util";

export default function simplifyGeojson(
  geojson: FeatureCollection
): FeatureCollection {
  let topo = topology({ foo: geojson });
  topo = presimplify(topo);
  topo = simplify(topo, 20000000);
  const simplifiedGeojson = feature(topo, "foo" as any);
  simplifiedGeojson.bbox = geojson.bbox;
  return simplifiedGeojson as any;
}
