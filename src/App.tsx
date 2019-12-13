import React from "react";
import "./App.css";
import districts from "../src/districts/la.json";
import { Puzzle } from "./Puzzle";
import { Piece } from "./types";
import { Timer } from "./Timer";
import { EndSlide } from "./EndSlide";

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
    startTime: number;
    pieces: Piece[];
    duration: number;
    solved: boolean;
  }
> {
  public interval: NodeJS.Timeout;
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date().getTime(),
      pieces: getPieces(),
      duration: 0,
      solved: false
    };
  }
  render() {
    const viewBox = districts.viewBox;
    const timer = this.state.solved ? null : (
      <Timer time={this.state.duration} />
    );
    const endSlide = this.state.solved ? (
      <EndSlide time={this.state.duration} />
    ) : null;

    return (
      <div className="App">
        {endSlide}
        {timer}
        <Puzzle
          solved={this.state.solved}
          onSolved={this.handleSolved.bind(this)}
          pieces={this.state.pieces}
          viewBox={[viewBox.minX, viewBox.minY, viewBox.width, viewBox.height]}
          devMode={false}
        />
      </div>
    );
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
    if (this.state.solved) return;
    this.setState({
      duration: Math.round(new Date().getTime() - this.state.startTime)
    });
  }
  handleSolved() {
    clearInterval(this.interval);
    this.setState({
      solved: true
    });
  }
}

export default App;
