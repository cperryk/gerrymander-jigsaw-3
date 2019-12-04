import React, { Ref } from "react";
import "./App.css";
import districts from "../src/districts/al.json";
import Draggable from "react-draggable";
import chroma from "chroma-js";

function getDistricts(): DistrictData[] {
  return Object.entries(districts).map(([key, paths]) => ({ key, paths }));
}

type DistrictData = { paths: string[]; key: string };

class App extends React.Component<
  {},
  {
    districts: DistrictData[];
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      districts: getDistricts()
    };
  }
  render() {
    return (
      <div className="App">
        <Puzzle
          pathSets={this.state.districts.map(district => district.paths)}
        />
      </div>
    );
  }
}

class Puzzle extends React.Component<
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
  }
> {
  solutions: { [key: string]: boolean } = {};
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
      solved: false
    };
  }
  render() {
    const pieces = this.state.pieces.map((piece, index) => (
      <PuzzlePiece
        paths={piece.paths}
        key={piece.key}
        color={piece.color}
        tolerance={20}
        onDragStart={() => this.handleDrag(index)}
        onDragStop={isSolved => this.handleDragStop(piece.key, isSolved)}
        solved={this.state.solved}
      />
    ));
    return (
      <div className="Puzzle">
        <svg width={1000} height={1000} viewBox="0 0 1000 1000">
          <PuzzleGuide
            color="#e3e3e3"
            paths={[].concat(this.state.pieces.map(piece => piece.paths))}
          />
          {pieces}
        </svg>
      </div>
    );
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
    if (this.isAllSolved()) {
      this.setState({
        solved: true
      });
    }
  }
  isAllSolved(): boolean {
    return Object.values(this.solutions).every(val => val === true);
  }
}

class PuzzleGuide extends React.Component<{
  paths: string[];
  color: string;
}> {
  constructor(props) {
    super(props);
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="{this.props.color}"
          strokeWidth={0.5}
          fill={this.props.color}
          key={index}
        />
      );
    });
    return <g>{pathEls}</g>;
  }
}

class PuzzlePiece extends React.PureComponent<
  {
    paths: string[];
    onDragStart: () => any;
    onDragStop: (isSolved: boolean) => any;
    color: string;
    tolerance: number;
    solved: boolean;
  },
  {
    translate: [number, number];
    color: string;
    hoverColor: string;
    dragColor: string;
    dragging: boolean;
  }
> {
  private myRef: Ref<SVGGElement>;
  private originalPosition: { x: number; y: number };
  private solutionBounds: { x1: number; x2: number; y1: number; y2: number };
  constructor(props) {
    super(props);
    this.state = {
      translate: [50, 0],
      dragColor: "yellow",
      hoverColor: "rgb(100%, 100%, 44.1%)",
      color: this.props.color,
      dragging: false
    };
    this.myRef = React.createRef();
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="gray"
          strokeWidth={0.2}
          fill={this.state.color}
          key={index}
          strokeLinecap="square"
          strokeMiterlimit={4}
          cursor={this.props.solved ? "normal" : "move"}
        />
      );
    });
    return (
      <Draggable
        scale={1}
        onStart={this.handleDragStart.bind(this)}
        onStop={this.handleDragStop.bind(this)}
        disabled={this.props.solved}
      >
        <g
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          ref={this.myRef}
        >
          {pathEls}
        </g>
      </Draggable>
    );
  }
  getPosition(): { x: number; y: number } | null {
    if (typeof this.myRef === "object" && this.myRef && this.myRef.current) {
      const rect = this.myRef.current.getBoundingClientRect();
      return { x: rect.left - window.scrollX, y: rect.top - window.scrollY };
    }
  }
  componentDidMount() {
    if (typeof this.myRef === "object" && this.myRef && this.myRef.current) {
      this.originalPosition = this.getPosition();
      this.solutionBounds = {
        x1: this.originalPosition.x - this.props.tolerance,
        x2: this.originalPosition.x + this.props.tolerance,
        y1: this.originalPosition.y - this.props.tolerance,
        y2: this.originalPosition.y + this.props.tolerance
      };
    }
  }
  componentDidUpdate() {
    if (this.props.solved && typeof this.myRef === "object") {
      const { x, y } = this.originalPosition;
      this.myRef.current.setAttribute("transform", "");
    }
  }
  handleMouseOver() {
    if (this.props.solved || this.state.dragging) return;
    this.setState({
      color: this.state.hoverColor
    });
  }
  handleMouseOut() {
    if (this.props.solved || this.state.dragging) return;
    this.setState({
      color: this.props.color
    });
  }
  handleDragStart() {
    this.setState({
      dragging: true,
      color: this.state.dragColor
    });
    this.props.onDragStart();
  }
  handleDragStop() {
    this.setState({
      dragging: false,
      color: this.props.color
    });
    this.props.onDragStop(this.isSolved());
  }
  isSolved(): boolean {
    const { x, y } = this.getPosition();
    return (
      x > this.solutionBounds.x1 &&
      x < this.solutionBounds.x2 &&
      y > this.solutionBounds.y1 &&
      y < this.solutionBounds.y2
    );
  }
}

export default App;
