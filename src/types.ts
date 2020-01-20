export type Piece = {
  paths: string[];
  key: string;
  transform: [number, number];
};

export enum PuzzleState {
  initial,
  edited,
  solved
}

export interface PuzzleConfiguration {
  viewBox: [number, number, number, number];
  pieces: Piece[];
  title: string;
  shareText: string;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface RawConfig {
  transforms: { [key: string]: [string, string] };
  paths: { [key: string]: string[] };
  viewBox: { minX: number; minY: number; width: number; height: number };
  title: string;
  shareText: string;
}

export interface QueryParams {
  puzzle: string;
  parentUrl?: string;
}
