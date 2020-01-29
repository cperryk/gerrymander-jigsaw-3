import pym from "pym.js";
import React from "react";
import { FaRedo } from "react-icons/fa";
import "./App.css";
import { EndSlide } from "./EndSlide";
import { Puzzle } from "./Puzzle";
import { StartSlide } from "./StartSlide";
import { Timer } from "./Timer";
import { Dimensions, Piece, PuzzleConfiguration } from "./types";
import {
  constrainToAspectRatio,
  formatTimeVerbose,
  millisecondsSince,
  getDevMode
} from "./utils";

const ASPECT_RATIO = 0.5;

class LoadedApp extends React.Component<
  {
    data: PuzzleConfiguration;
  },
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
    const { pieces, viewBox, title, shareText } = this.props.data;
    this.state = {
      pieces,
      viewBox,
      title,
      shareText,
      startTime: new Date(),
      duration: 0,
      stage: "start",
      dimensions: {
        width: window.innerWidth,
        height: constrainToAspectRatio(
          { width: window.innerWidth, height: window.innerHeight },
          ASPECT_RATIO
        ).height
      }
    };
    this.handleSolved = this.handleSolved.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
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
          <div className="App no-touch-action">
            <div className="top-bar">
              <Timer time={this.state.duration} />
              <div className="puzzle-btn" onClick={this.handleRestart}>
                <FaRedo />
                <span>Restart</span>
              </div>
            </div>
            <Puzzle
              stage="editing"
              onSolved={this.handleSolved}
              pieces={this.state.pieces}
              viewBox={this.state.viewBox}
              width={this.state.dimensions.width}
              height={this.state.dimensions.height}
              devMode={getDevMode()}
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
        dimensions: {
          width: window.innerWidth,
          height: constrainToAspectRatio(
            {
              width: width,
              height: Number(height)
            },
            ASPECT_RATIO
          ).height
        }
      });
      pymChild.sendHeight();
    });
  }
  handleResize() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      this.setState({
        dimensions: {
          width,
          height: constrainToAspectRatio(
            {
              width: width,
              height: window.innerHeight
            },
            ASPECT_RATIO
          ).height
        }
      });
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
      stage: "start",
      duration: 0
    });
  }
  handleTouchStart(e: TouchEvent) {
    if (this.state.stage === "puzzle") {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}

export default LoadedApp;
