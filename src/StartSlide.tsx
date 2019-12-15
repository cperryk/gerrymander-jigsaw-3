import React from "react";

export const StartSlide: React.FunctionComponent<{
  title: string;
  onStart: () => any;
}> = props => {
  return (
    <div className="slide">
      <div>
        <h2>{props.title}</h2>
        <button className="btn-start" onClick={props.onStart}>
          Start
        </button>
      </div>
    </div>
  );
};
