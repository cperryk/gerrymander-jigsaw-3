import React, { Ref } from "react";
export class PuzzleGuide extends React.Component<{
  paths: string[];
}> {
  public ref: Ref<SVGGElement>;
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return <path className="puzzle-guide-path" d={path} key={index} />;
    });
    return <g ref={this.ref}>{pathEls}</g>;
  }
  getBbox(): ClientRect | null {
    const ref = this.ref;
    if (typeof ref === "object" && ref && ref.current) {
      return ref.current.getBoundingClientRect();
    }
  }
}
