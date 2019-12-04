import React, { FunctionComponent } from "react";
import "./App.css";
import districts from "../src/districts/al.json";
import Draggable from "react-draggable";
import chroma from "chroma-js";
import { range } from "d3";

function getDistricts(): DistrictData[] {
  // return { "AL-01": districts["AL-01"] };
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
  }
> {
  constructor(props) {
    super(props);
    const colorScale = chroma
      .scale("RdYlBu")
      .domain(range(props.pathSets.length), props.pathSets.length, "quantiles");
    this.state = {
      pieces: props.pathSets.map((paths, index) => ({
        key: index,
        paths,
        color: colorScale(index / paths.length).hex()
      }))
    };
  }
  render() {
    return (
      <div className="Puzzle">
        <svg width={1000} height={1000} viewBox="-8847 3022 478 478">
          {this.state.pieces.map((piece, index) => (
            <PuzzlePiece
              paths={piece.paths}
              key={piece.key}
              color={piece.color}
              onDragStart={() => this.handleDrag(index)}
              onDragStop={() => this.handleDragStop()}
            />
          ))}
        </svg>
      </div>
    );
  }
  movePieceToFront(index: number) {
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
  handleDragStop() {
    console.log("handle drag end");
  }
}

class PuzzlePiece extends React.Component<
  {
    paths: string[];
    onDragStart: () => any;
    onDragStop: () => any;
    color: string;
  },
  {
    translate: [number, number];
    color: string;
    hoverColor: string;
    dragColor: string;
    dragging: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      translate: [50, 0],
      dragColor: "yellow",
      hoverColor: "rgb(100%, 100%, 44.1%)",
      color: this.props.color,
      dragging: false
    };
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="gray"
          strokeWidth={0.5}
          fill={this.state.color}
          key={index}
          cursor="move"
        />
      );
    });
    return (
      <Draggable
        scale={1000 / 478}
        onStart={this.handleDragStart.bind(this)}
        onStop={this.handleDragStop.bind(this)}
      >
        <g
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
        >
          {pathEls}
        </g>
      </Draggable>
    );
  }
  handleMouseOver() {
    if (!this.state.dragging) {
      this.setState({
        color: this.state.hoverColor
      });
    }
  }
  handleMouseOut() {
    if (!this.state.dragging) {
      this.setState({
        color: this.props.color
      });
    }
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
    this.props.onDragStop();
  }
}

export default App;
