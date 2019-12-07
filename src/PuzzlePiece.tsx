import React, { Ref } from "react";
import Draggable from "react-draggable";
export class PuzzlePiece extends React.PureComponent<
  {
    paths: string[];
    onDragStart: () => any;
    onDragStop: () => any;
    color: string;
    solved: boolean;
    dragScale: number;
  },
  {
    translate: [number, number];
    color: string;
    hoverColor: string;
    dragColor: string;
    dragging: boolean;
  }
> {
  private ref: Ref<SVGGElement>;
  constructor(props) {
    super(props);
    this.state = {
      translate: [50, 0],
      dragColor: "yellow",
      hoverColor: "rgb(100%, 100%, 44.1%)",
      color: this.props.color,
      dragging: false
    };
    this.ref = React.createRef();
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="gray"
          strokeWidth={0.05}
          fill={this.state.color}
          key={index}
          strokeLinecap="square"
          strokeMiterlimit={4}
          cursor={this.props.solved ? "normal" : "move"}
        />
      );
    });
    return (
      <Draggable
        scale={this.props.dragScale}
        onStart={this.handleDragStart.bind(this)}
        onStop={this.handleDragStop.bind(this)}
        disabled={this.props.solved}
      >
        <g
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseOut={this.handleMouseOut.bind(this)}
          ref={this.ref}
        >
          {pathEls}
        </g>
      </Draggable>
    );
  }
  getBbox(): ClientRect | null {
    const ref = this.ref;
    if (typeof ref === "object" && ref && ref.current) {
      return ref.current.getBoundingClientRect();
    }
  }
  componentDidUpdate() {
    if (this.props.solved && typeof this.ref === "object") {
      this.ref.current.setAttribute("transform", "");
    }
  }
  handleMouseOver() {
    if (this.props.solved || this.state.dragging) return;
    this.setState({
      color: this.state.hoverColor
    });
  }
  handleMouseOut() {
    if (this.props.solved || this.state.dragging) return;
    this.setState({
      color: this.props.color
    });
  }
  handleDragStart() {
    this.setState({
      dragging: true,
      color: this.state.dragColor
    });
    this.props.onDragStart();
  }
  handleDragStop() {
    this.setState({
      dragging: false,
      color: this.props.color
    });
    this.props.onDragStop();
  }
}
