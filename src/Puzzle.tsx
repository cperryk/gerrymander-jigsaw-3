import React, { Ref } from "react";
import chroma from "chroma-js";
import { PuzzlePiece } from "./PuzzlePiece";
import { PuzzleGuide } from "./PuzzleGuide";
export class Puzzle extends React.Component<
  {
    pathSets: string[][];
  },
  {
    pieces: {
      key: string;
      paths: string[];
      color: string;
    }[];
    solved: boolean;
    dragScale: number; // number of pixels per svg unit
  }
> {
  solutions: {
    [key: string]: boolean;
  } = {};
  private ref: Ref<HTMLDivElement>;
  constructor(props) {
    super(props);
    const colorScale = chroma
      .scale("RdYlBu")
      .domain([0, props.pathSets.length], props.pathSets.length, "quantiles");
    this.state = {
      pieces: props.pathSets.map((paths, index) => ({
        key: index,
        paths,
        color: colorScale(index / paths.length).hex()
      })),
      solved: false,
      dragScale: 1
    };
    this.solutions = this.props.pathSets.reduce((prev, curr, index) => {
      prev[index] = false;
      return prev;
    }, {});
    this.ref = React.createRef();
  }
  render() {
    const pieces = this.state.pieces.map((piece, index) => (
      <PuzzlePiece
        paths={piece.paths}
        key={piece.key}
        color={piece.color}
        tolerance={30}
        onDragStart={() => this.handleDrag(index)}
        onDragStop={isSolved => this.handleDragStop(piece.key, isSolved)}
        solved={this.state.solved}
        dragScale={this.state.dragScale}
      />
    ));
    return (
      <div className="Puzzle" ref={this.ref}>
        <svg width="100%" height={1000} viewBox="0 0 1000 1000">
          <PuzzleGuide
            color="#e3e3e3"
            paths={[].concat(this.state.pieces.map(piece => piece.paths))}
          />
          {pieces}
        </svg>
      </div>
    );
  }
  componentDidMount() {
    this.refreshDragScale();
  }
  refreshDragScale() {
    if (typeof this.ref === "object") {
      const { width } = this.ref.current.getBoundingClientRect();
      this.setState({
        dragScale: width / 1000
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
  handleDragStop(key: string, isSolved: boolean) {
    this.solutions[key] = isSolved;
    console.log(this.solutions);
    if (this.isAllSolved()) {
      window.alert("solved!");
      this.setState({
        solved: true
      });
    }
  }
  isAllSolved(): boolean {
    return Object.values(this.solutions).every(val => val === true);
  }
}
