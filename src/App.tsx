import React from "react";
import "./App.css";

const { Paper, Rect } = require("react-raphael");

const App: React.FC = () => {
  return (
    <div className="App">
      <Paper width={300} height={300}>
        <Rect
          x={30}
          y={148}
          width={240}
          height={150}
          attr={{ fill: "#10a54a", stroke: "#f0c620", "stroke-width": 5 }}
        />
      </Paper>
    </div>
  );
};

export default App;
