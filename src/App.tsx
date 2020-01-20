import LoadedApp from "./LoadedApp";
import React from "react";
import { Fetch } from "react-request";
import { getConfigUrl, parseConfig } from "./utils";

class App extends React.Component<{}, {}> {
  render() {
    return (
      <Fetch url={getConfigUrl()} responseType="json">
        {({ fetching, failed, data }) => {
          if (fetching) {
            return <div>Loading puzzle...</div>;
          } else if (failed) {
            return <div>Failed to load puzzle. Please try again later.</div>;
          } else if (data) {
            return <LoadedApp data={parseConfig(data)}></LoadedApp>;
          }
          return null;
        }}
      </Fetch>
    );
  }
}

export default App;
