import React from "react";
import "./App.css";
import { EndSlide } from "./EndSlide";
import { Puzzle } from "./Puzzle";
import { StartSlide } from "./StartSlide";
import { Timer } from "./Timer";
import { Piece, Dimensions } from "./types";
import {
  formatTimeVerbose,
  getData,
  millisecondsSince,
  constrainToAspectRatio
} from "./utils";
import pym from "pym.js";

const ASPECT_RATIO = 0.5;

class App extends React.Component<
  {},
  {
    stage: "start" | "puzzle" | "end";
    startTime: Date;
    pieces: Piece[];
    duration: number;
    viewBox: [number, number, number, number];
    title: string;
    shareText: string;
    dimensions: Dimensions;
  }
> {
  public interval: NodeJS.Timeout;
  constructor(props) {
    super(props);
    const { pieces, viewBox, title, shareText } = getData();
    this.state = {
      pieces,
      viewBox,
      title,
      shareText,
      startTime: new Date(),
      duration: 0,
      stage: "start",
      dimensions: constrainToAspectRatio(
        {
          width: window.innerWidth,
          height: window.innerHeight
        },
        ASPECT_RATIO
      )
    };
    this.handleSolved = this.handleSolved.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }
  render() {
    switch (this.state.stage) {
      case "start":
        return (
          <div className="App">
            <StartSlide title={this.state.title} onStart={this.handleStart} />
            <Puzzle
              stage="initial"
              pieces={this.state.pieces}
              viewBox={this.state.viewBox}
              width={this.state.dimensions.width}
              height={this.state.dimensions.height}
            />
          </div>
        );
      case "puzzle":
        return (
          <div className="App">
            <Timer time={this.state.duration} />
            <Puzzle
              stage="editing"
              onSolved={this.handleSolved}
              pieces={this.state.pieces}
              viewBox={this.state.viewBox}
              width={this.state.dimensions.width}
              height={this.state.dimensions.height}
            />
          </div>
        );
      case "end":
        const timeVerbose = formatTimeVerbose(this.state.duration);
        const shareText = this.state.shareText.replace("{time}", timeVerbose);
        return (
          <div className="App">
            <EndSlide
              title="Solved!"
              subtitle={`You solved the puzzle in ${timeVerbose}!`}
              shareText={shareText}
              onRestart={this.handleRestart}
            />
            <Puzzle
              stage="end"
              pieces={this.state.pieces}
              viewBox={this.state.viewBox}
              width={this.state.dimensions.width}
              height={this.state.dimensions.height}
            />
          </div>
        );
    }
  }
  componentDidMount() {
    document.addEventListener("touchstart", this.handleTouchStart);
    this.interval = setInterval(() => this.incrementTime(), 1000);
    const pymChild = new pym.Child();
    pymChild.getParentPositionInfo();
    pymChild.onMessage("viewport-iframe-position", message => {
      const [width, height] = message.split(" ");
      this.setState({
        dimensions: constrainToAspectRatio(
          {
            width: Math.min(window.innerWidth, Number(width)),
            height: Number(height)
          },
          ASPECT_RATIO
        )
      });
      pymChild.sendHeight();
    });
  }
  componentWillUnmount() {
    document.removeEventListener("touchstart", this.handleTouchStart);
    clearInterval(this.interval);
  }
  incrementTime() {
    if (this.state.stage !== "puzzle") return;
    this.setState({
      duration: Math.round(millisecondsSince(this.state.startTime))
    });
  }
  handleStart() {
    this.setState({
      startTime: new Date(),
      stage: "puzzle"
    });
  }
  handleSolved() {
    this.setState({
      stage: "end"
    });
  }
  handleRestart() {
    this.setState({
      startTime: new Date(),
      stage: "puzzle",
      duration: 0
    });
  }
  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default App;
