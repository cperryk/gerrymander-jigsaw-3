import React, { Ref } from "react";
import Draggable from "react-draggable";
export class PuzzlePiece extends React.PureComponent<
  {
    paths: string[];
    onDragStart: () => any;
    onDragStop: (isSolved: boolean) => any;
    color: string;
    tolerance: number;
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
  private myRef: Ref<SVGGElement>;
  private originalPosition: {
    x: number;
    y: number;
  };
  private solutionBounds: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  constructor(props) {
    super(props);
    this.state = {
      translate: [50, 0],
      dragColor: "yellow",
      hoverColor: "rgb(100%, 100%, 44.1%)",
      color: this.props.color,
      dragging: false
    };
    this.myRef = React.createRef();
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          stroke="gray"
          strokeWidth={0.2}
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
          ref={this.myRef}
        >
          {pathEls}
        </g>
      </Draggable>
    );
  }
  getPosition(): {
    x: number;
    y: number;
  } | null {
    if (typeof this.myRef === "object" && this.myRef && this.myRef.current) {
      const rect = this.myRef.current.getBoundingClientRect();
      return { x: rect.left - window.scrollX, y: rect.top - window.scrollY };
    }
  }
  componentDidMount() {
    if (typeof this.myRef === "object" && this.myRef && this.myRef.current) {
      this.originalPosition = this.getPosition();
      this.solutionBounds = {
        x1: this.originalPosition.x - this.props.tolerance,
        x2: this.originalPosition.x + this.props.tolerance,
        y1: this.originalPosition.y - this.props.tolerance,
        y2: this.originalPosition.y + this.props.tolerance
      };
    }
  }
  componentDidUpdate() {
    if (this.props.solved && typeof this.myRef === "object") {
      this.myRef.current.setAttribute("transform", "");
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
    this.props.onDragStop(this.isSolved());
  }
  isSolved(): boolean {
    const { x, y } = this.getPosition();
    return (
      x > this.solutionBounds.x1 &&
      x < this.solutionBounds.x2 &&
      y > this.solutionBounds.y1 &&
      y < this.solutionBounds.y2
    );
  }
}
