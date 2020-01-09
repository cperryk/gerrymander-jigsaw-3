import React, { Ref } from "react";
import chroma from "chroma-js";
import { PuzzlePiece } from "./PuzzlePiece";
import { PuzzleGuide } from "./PuzzleGuide";
import { Piece } from "./types";
import { DraggableData } from "react-draggable";

export class Puzzle extends React.PureComponent<
  {
    pieces: Piece[];
    stage: "initial" | "editing" | "end";
    viewBox: [number, number, number, number];
    devMode?: boolean;
    width: number;
    height: number;
    onSolved?: () => any;
  },
  {
    pieces: {
      key: string;
      paths: string[];
      color: string;
      guideRef: Ref<PuzzleGuide>;
      pieceRef: Ref<PuzzlePiece>;
      position: [number, number];
      originalPosition: [number, number];
    }[];
    tolerance: number;
  }
> {
  private ref: Ref<SVGSVGElement>;
  constructor(props) {
    super(props);
    const colorScale = chroma
      .scale("Spectral")
      .domain([0, props.pieces.length], props.pieces.length);

    this.state = {
      pieces: props.pieces.map((piece, index) => ({
        key: piece.key,
        paths: piece.paths,
        originalPosition: piece.transform,
        position: piece.transform,
        color: colorScale(index),
        guideRef: React.createRef(),
        pieceRef: React.createRef()
      })),
      tolerance: 30
    };
    this.ref = React.createRef();
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
  }
  render() {
    const dragScale = this.getDragScale(this.props.width, this.props.height);
    const pieces = this.state.pieces.map((piece, index) => (
      <PuzzlePiece
        index={index}
        paths={piece.paths}
        key={piece.key}
        color={piece.color}
        onDragStart={this.handleDragStart}
        onDragStop={this.handleDragStop}
        dragScale={dragScale}
        ref={piece.pieceRef}
        locked={this.props.stage === "end"}
        position={piece.position}
      />
    ));
    const guides = this.state.pieces.map((piece, index) => (
      <PuzzleGuide paths={piece.paths} ref={piece.guideRef} key={index} />
    ));
    const bboxGuide = this.props.devMode ? (
      <rect
        x={this.props.viewBox[0]}
        y={this.props.viewBox[1]}
        width={this.props.viewBox[2]}
        height={this.props.viewBox[3]}
      ></rect>
    ) : null;
    return (
      <div className="Puzzle">
        <svg
          width={this.props.width}
          height={this.props.height}
          viewBox={this.props.viewBox.join(" ")}
          ref={this.ref}
        >
          {bboxGuide}
          {guides}
          {pieces}
        </svg>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.stage !== this.props.stage) {
      switch (this.props.stage) {
        case "editing":
        case "initial":
          this.setState({
            pieces: this.state.pieces.map(piece => {
              piece.position = piece.originalPosition;
              return piece;
            })
          });
          break;
        case "end":
          this.setState({
            pieces: this.state.pieces.map(piece => {
              piece.position = [0, 0];
              return piece;
            })
          });
          break;
      }
    }
  }
  getDragScale(width: number, height: number): number {
    if (typeof this.ref !== "object") return;
    const { viewBox } = this.props;
    const viewPortAspectRatio = width / height;
    const viewBoxAspectRatio = viewBox[2] / viewBox[3];
    const heightLimited = viewPortAspectRatio > viewBoxAspectRatio;
    const pixelsPerCoord = heightLimited
      ? height / this.props.viewBox[3]
      : width / this.props.viewBox[2];
    return pixelsPerCoord;
  }
  movePieceToFront(index: number) {
    if (index === this.state.pieces.length - 1) return;
    this.setState({
      pieces: [
        ...this.state.pieces.slice(0, index),
        ...this.state.pieces.slice(index + 1, this.state.pieces.length),
        this.state.pieces[index]
      ]
    });
  }
  isPieceSolved(index: number): boolean {
    const {
      position: [x, y]
    } = this.state.pieces[index];
    const { tolerance } = this.state;
    return x > -tolerance && x < tolerance && y > -tolerance && y < tolerance;
  }
  isAllSolved() {
    this.state.pieces.forEach((piece, index) => this.isPieceSolved(index));
    return this.state.pieces.every((piece, index) => this.isPieceSolved(index));
  }
  handleDragStart(index: number) {
    this.movePieceToFront(index);
  }
  handleDragStop(index: number, e: DraggableData) {
    const piece = this.state.pieces[index];
    piece.position = [e.x, e.y];

    this.setState({
      pieces: [...this.state.pieces]
    });

    if (this.isAllSolved()) {
      this.props.onSolved();
    }
    this.logPositions();
  }
  // for development
  logPositions() {
    if (!this.props.devMode) return;
    const positions = this.state.pieces.reduce((prev, curr) => {
      const position = curr.position;
      if (position) {
        const [x, y] = position;
        prev[curr.key] = [x.toFixed(1), y.toFixed(1)];
      }
      return prev;
    }, {});
    console.log(JSON.stringify(positions));
  }
}
