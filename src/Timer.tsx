import React from "react";
import { formatTime } from "./utils";
import { FaStopwatch } from "react-icons/fa";

export const Timer: React.FunctionComponent<{ time: number }> = ({ time }) => {
  return (
    <div className="timer">
      <FaStopwatch /> <span className="time">{formatTime(time)}</span>
    </div>
  );
};
