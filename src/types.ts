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
