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
    }[];
    solved: boolean;
    dragScale: number; // number of pixels per svg unit
    tolerance: number;
  }
> {
  private ref: Ref<SVGSVGElement>;
  private guideRefs: Ref<PuzzleGuide>[];
  private pieceRefs: Ref<PuzzlePiece>[];
  private resizeHandler?: (...args: any[]) => any;
  constructor(props) {
    super(props);
    const colorScale = chroma
      .scale("Spectral")
      .domain([0, props.pieces.length], props.pieces.length);
    this.state = {
      pieces: props.pieces.map((piece, index) => ({
        key: index,
        paths: piece.paths,
        transform: piece.transform,
        color: colorScale(index)
      })),
      solved: false,
      dragScale: 1,
      tolerance: 30
    };
    this.ref = React.createRef();
    this.guideRefs = this.state.pieces.map(() => React.createRef());
    this.pieceRefs = this.state.pieces.map(() => React.createRef());
  }
  render() {
    console.log(this.state.pieces);
    const pieces = this.state.pieces.map((piece, index) => (
      <PuzzlePiece
        paths={piece.paths}
        key={piece.key}
        color={piece.color}
        onDragStart={() => this.handleDrag(index)}
        onDragStop={() => this.handleDragStop()}
        solved={this.state.solved}
        dragScale={this.state.dragScale}
        ref={this.pieceRefs[index]}
        transform={piece.transform}
      />
    ));
    const guides = this.state.pieces.map((piece, index) => (
      <PuzzleGuide
        paths={piece.paths}
        ref={this.guideRefs[index]}
        key={index}
      />
    ));
    return (
      <div className="Puzzle">
        <svg
          width="100%"
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
    window.document.addEventListener("touchforcechange", e => {
      e.preventDefault();
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }
  refreshDragScale() {
    if (typeof this.ref === "object") {
      const { width, height } = this.ref.current.getBoundingClientRect();
      this.setState({
        dragScale: Math.min(width, height) / 100
      });
    }
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
    const guideRef = this.guideRefs[index];
    const pieceRef = this.pieceRefs[index];
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
  }
}
