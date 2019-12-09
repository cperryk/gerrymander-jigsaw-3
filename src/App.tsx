import React from "react";
import "./App.css";
import districts from "../src/districts/la.json";
import { Puzzle } from "./Puzzle";
import { Piece } from "./types";

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
    pieces: Piece[];
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      pieces: getPieces()
    };
  }
  render() {
    const viewBox = districts.viewBox;
    return (
      <div className="App">
        <Puzzle
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
  }
}

export default App;
