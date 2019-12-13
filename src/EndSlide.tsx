import React from "react";
import { formatTime } from "./utils";

export const EndSlide: React.FunctionComponent<{ time: number }> = ({
  time
}) => {
  return (
    <div className="end-slide">
      <div>
        <h2>Completed!</h2>
        <p>You solved the puzzle in {formatTime(time)}.</p>
      </div>
    </div>
  );
};
