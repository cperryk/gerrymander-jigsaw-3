import React from "react";

export const Timer: React.FunctionComponent<{ time: number }> = ({ time }) => {
  return (
    <div className="timer">{new Date(time).toISOString().substr(14, 5)}</div>
  );
};
