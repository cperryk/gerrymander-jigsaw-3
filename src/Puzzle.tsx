import React, { Ref } from "react";
import chroma from "chroma-js";
import { PuzzlePiece } from "./PuzzlePiece";
import { PuzzleGuide } from "./PuzzleGuide";
import { Piece } from "./types";

export class Puzzle extends React.Component<
  {
    pieces: Piece[];
  },
  {
    pieces: {
      key: string;
      paths: string[];
      color: string;
      transform: [number, number];
      guideRef: Ref<PuzzleGuide>;
      pieceRef: Ref<PuzzlePiece>;
    }[];
    solved: boolean;
    dragScale: number; // number of pixels per svg unit
    tolerance: number;
  }
> {
  private ref: Ref<SVGSVGElement>;
  private resizeHandler?: (...args: any[]) => any;
  constructor(props) {
    super(props);
    const colorScale = chroma
      .scale("Spectral")
      .domain([0, props.pieces.length], props.pieces.length);
    this.state = {
      pieces: props.pieces.map((piece, index) => ({
        key: piece.key,
        paths: piece.paths,
        transform: piece.transform,
        color: colorScale(index),
        guideRef: React.createRef(),
        pieceRef: React.createRef()
      })),
      solved: false,
      dragScale: 1,
      tolerance: 30
    };
    this.ref = React.createRef();
  }
  render() {
    const pieces = this.state.pieces.map((piece, index) => (
      <PuzzlePiece
        paths={piece.paths}
        key={piece.key}
        color={piece.color}
        onDragStart={() => this.handleDrag(index)}
        onDragStop={() => this.handleDragStop()}
        solved={this.state.solved}
        dragScale={this.state.dragScale}
        ref={piece.pieceRef}
        transform={piece.transform}
      />
    ));
    const guides = this.state.pieces.map((piece, index) => (
      <PuzzleGuide paths={piece.paths} ref={piece.guideRef} key={index} />
    ));
    return (
      <div className="Puzzle">
        <svg
          width={window.innerWidth}
          height={window.innerHeight}
          viewBox="0 0 100 100"
          ref={this.ref}
        >
          {guides}
          {pieces}
        </svg>
      </div>
    );
  }
  componentDidMount() {
    this.refreshDragScale();
    this.resizeHandler = this.refreshDragScale.bind(this);
    window.addEventListener("resize", this.resizeHandler);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }
  refreshDragScale() {
    this.setState({
      dragScale: Math.min(window.innerWidth, window.innerHeight) / 100
    });
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
  handleDrag(index: number) {
    this.movePieceToFront(index);
  }
  isPieceSolved(index: number): boolean {
    const { guideRef, pieceRef } = this.state.pieces[index];
    const { tolerance } = this.state;
    if (!(typeof pieceRef === "object" && typeof guideRef === "object")) {
      return false;
    }
    const pieceBbox = pieceRef.current.getBbox();
    const guideBbox = guideRef.current.getBbox();
    const solutionBounds = {
      x1: guideBbox.left - tolerance,
      x2: guideBbox.left + tolerance,
      y1: guideBbox.top - tolerance,
      y2: guideBbox.top + tolerance
    };
    const { left: x, top: y } = pieceBbox;
    const out =
      x > solutionBounds.x1 &&
      x < solutionBounds.x2 &&
      y > solutionBounds.y1 &&
      y < solutionBounds.y2;
    return out;
  }
  isAllSolved() {
    return this.state.pieces.every((piece, index) => this.isPieceSolved(index));
  }
  handleDragStop() {
    if (this.isAllSolved()) {
      this.setState({
        solved: true
      });
      window.alert("solved!");
    }
    this.logPositions();
  }
  // for development
  logPositions() {
    const positions = this.state.pieces.reduce((prev, curr) => {
      const { pieceRef } = curr;
      if (
        typeof pieceRef === "object" &&
        typeof pieceRef.current.ref === "object"
      ) {
        const position = pieceRef.current.getPosition();
        if (position) {
          const [x, y] = position;
          prev[curr.key] = [x.toFixed(1), y.toFixed(1)];
        }
      }
      return prev;
    }, {});
    console.log(JSON.stringify(positions));
  }
}
