import React from "react";
import "./App.css";
import districts from "../src/districts/la.json";
import { Puzzle } from "./Puzzle";
import { Piece } from "./types";
import { Timer } from "./Timer";
import { EndSlide } from "./EndSlide";
import { formatTimeVerbose } from "./utils";
import { StartSlide } from "./StartSlide";

function getPieces(): Piece[] {
  return Object.entries(districts.paths).map(([key, paths]) => {
    const [x, y] = districts.transforms[key] || ["0", "0"];
    return {
      key,
      paths,
      transform: [parseFloat(x), parseFloat(y)]
    };
  });
}

class App extends React.Component<
  {},
  {
    stage: "start" | "puzzle" | "end";
    startTime: number;
    pieces: Piece[];
    duration: number;
    edited: boolean;
  }
> {
  public interval: NodeJS.Timeout;
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date().getTime(),
      pieces: getPieces(),
      duration: 0,
      stage: "start",
      edited: false
    };
  }
  render() {
    switch (this.state.stage) {
      case "start":
        return (
          <div className="App">
            <StartSlide
              title="How quickly can you put the pieces back together?"
              onStart={() => this.setState({ stage: "puzzle" })}
            />
            <Puzzle
              stage="initial"
              pieces={this.state.pieces}
              viewBox={[
                districts.viewBox.minX,
                districts.viewBox.minY,
                districts.viewBox.width,
                districts.viewBox.height
              ]}
            />
          </div>
        );
      case "puzzle":
        return (
          <div className="App">
            <Timer time={this.state.duration} />
            <Puzzle
              stage="editing"
              onEdited={this.handleEdit.bind(this)}
              pieces={this.state.pieces}
              viewBox={[
                districts.viewBox.minX,
                districts.viewBox.minY,
                districts.viewBox.width,
                districts.viewBox.height
              ]}
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
              onRestart={() => this.restart()}
            />
            <Puzzle
              stage="end"
              pieces={this.state.pieces}
              viewBox={[
                districts.viewBox.minX,
                districts.viewBox.minY,
                districts.viewBox.width,
                districts.viewBox.height
              ]}
            />
          </div>
        );
    }
  }
  componentDidMount() {
    document.addEventListener("touchstart", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.interval = setInterval(() => this.incrementTime(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  incrementTime() {
    if (this.state.stage !== "puzzle") return;
    this.setState({
      duration: Math.round(new Date().getTime() - this.state.startTime)
    });
  }
  handleEdit(solved: boolean) {
    if (solved) {
      this.setState({
        edited: true,
        stage: "end"
      });
    } else {
      this.setState({
        edited: true
      });
    }
  }
  handleSolved() {
    clearInterval(this.interval);
    this.setState({
      stage: "end"
    });
  }
  restart() {
    this.setState({
      startTime: new Date().getTime(),
      stage: "puzzle",
      duration: 0,
      edited: false
    });
  }
}

export default App;
