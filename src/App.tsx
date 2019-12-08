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
    return (
      <div className="App">
        <Puzzle pieces={this.state.pieces} />
      </div>
    );
  }
  componentDidMount() {
    document.addEventListener("touchstart", e => e.preventDefault());
  }
}

export default App;
