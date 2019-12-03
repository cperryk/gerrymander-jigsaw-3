import React, { FunctionComponent } from "react";
import "./App.css";
import districts from "../src/districts/al.json";
import randomcolor from "randomcolor";
import Draggable from "react-draggable";

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
    console.log("rerendering");
    return (
      <div className="App">
        <svg width={1000} height={1000} viewBox="-8847 3022 478 478">
          {this.state.districts.map((district, index) => (
            <District
              paths={district.paths}
              key={district.key}
              onDragStart={() => this.handleDrag(index)}
              onDragStop={() => this.handleDragStop()}
            />
          ))}
        </svg>
      </div>
    );
  }
  handleDrag(index: number) {
    console.log("handling drag", index);
    this.setState({
      districts: [
        ...this.state.districts.slice(0, index),
        ...this.state.districts.slice(index + 1, this.state.districts.length),
        this.state.districts[index]
      ]
    });
    console.log("handling drag", this.state.districts);
  }
  handleDragStop() {
    console.log("handle drag end");
  }
}

class District extends React.Component<
  { paths: string[]; onDragStart: () => any; onDragStop: () => any },
  {
    translate: [number, number];
    color: string;
    originalColor: string;
    hoverColor: string;
    dragColor: string;
    dragging: boolean;
  }
> {
  constructor(props) {
    super(props);
    const color = randomcolor();
    this.state = {
      translate: [50, 0],
      originalColor: color,
      dragColor: "yellow",
      hoverColor: "rgb(100%, 100%, 44.1%)",
      color,
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
        color: this.state.originalColor
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
      color: this.state.originalColor
    });
    this.props.onDragStop();
  }
}

export default App;
