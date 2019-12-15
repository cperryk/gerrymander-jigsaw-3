import React from "react";
import "./App.css";
import { EndSlide } from "./EndSlide";
import { Puzzle } from "./Puzzle";
import { StartSlide } from "./StartSlide";
import { Timer } from "./Timer";
import { Piece } from "./types";
import { formatTimeVerbose, getData, millisecondsSince } from "./utils";

class App extends React.Component<
  {},
  {
    stage: "start" | "puzzle" | "end";
    startTime: Date;
    pieces: Piece[];
    duration: number;
    viewBox: [number, number, number, number];
    title: string;
  }
> {
  public interval: NodeJS.Timeout;
  constructor(props) {
    super(props);
    const { pieces, viewBox, title } = getData();
    this.state = {
      pieces,
      viewBox,
      title,
      startTime: new Date(),
      duration: 0,
      stage: "start"
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
            />
          </div>
        );
      case "end":
        return (
          <div className="App">
            <EndSlide
              title="Solved!"
              subtitle={`You solved the puzzle in ${formatTimeVerbose(
                this.state.duration
              )}.`}
              shareText={`I solved the puzzle in ${formatTimeVerbose(
                this.state.duration
              )}`}
              onRestart={this.handleRestart}
            />
            <Puzzle
              stage="end"
              pieces={this.state.pieces}
              viewBox={this.state.viewBox}
            />
          </div>
        );
    }
  }
  componentDidMount() {
    document.addEventListener("touchstart", this.handleTouchStart);
    this.interval = setInterval(() => this.incrementTime(), 1000);
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
    this.setState({ stage: "puzzle" });
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
