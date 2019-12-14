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
