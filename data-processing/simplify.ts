import { topology } from "topojson-server";
import { FeatureCollection } from "geojson";
import { simplify, presimplify } from "topojson-simplify";
import { feature } from "topojson-client";
import { Conf } from "./conf";

export default function simplifyGeojson(
  geojson: FeatureCollection,
  conf: Conf
): FeatureCollection {
  let topo = topology({ foo: geojson });
  topo = presimplify(topo);
  topo = simplify(topo, conf.simplificationFactor);
  const simplifiedGeojson = feature(topo, "foo" as any);
  simplifiedGeojson.bbox = geojson.bbox;
  return simplifiedGeojson as any;
}
