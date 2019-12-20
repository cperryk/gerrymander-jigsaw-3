import React from "react";

export const StartSlide: React.FunctionComponent<{
  title: string;
  onStart: () => any;
}> = props => {
  return (
    <div className="slide">
      <div>
        <h2>{props.title}</h2>
        <div className="puzzle-btn" onClick={props.onStart}>
          Start!
        </div>
      </div>
    </div>
  );
};
