import React from "react";
export class PuzzleGuide extends React.Component<{
  paths: string[];
  color: string;
}> {
  constructor(props) {
    super(props);
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="{this.props.color}"
          strokeWidth={0.5}
          fill={this.props.color}
          key={index}
        />
      );
    });
    return <g>{pathEls}</g>;
  }
}
