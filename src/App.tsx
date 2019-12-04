import React from "react";
import "./App.css";
import districts from "../src/districts/al.json";
import { Puzzle } from "./Puzzle";

function getDistricts(): DistrictData[] {
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

export default App;
