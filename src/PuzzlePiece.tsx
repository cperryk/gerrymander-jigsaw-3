import React, { Ref } from "react";
import Draggable, { DraggableData } from "react-draggable";
export class PuzzlePiece extends React.PureComponent<
  {
    paths: string[];
    onDragStart: () => any;
    onDragStop: (DraggableData) => any;
    color: string;
    locked: boolean;
    dragScale: number;
    position: [number, number];
  },
  {
    color: string;
    hoverColor: string;
    dragColor: string;
    dragging: boolean;
  }
> {
  public ref: Ref<SVGGElement>;
  constructor(props) {
    super(props);
    this.state = {
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
          stroke="black"
          strokeWidth={1}
          fill={this.state.color}
          key={index}
          strokeLinecap="square"
          strokeMiterlimit={4}
          cursor={this.props.locked ? "normal" : "move"}
        />
      );
    });
    return (
      <Draggable
        scale={this.props.dragScale}
        onStart={this.handleDragStart.bind(this)}
        onStop={this.handleDragStop.bind(this)}
        disabled={this.props.locked}
        position={{ x: this.props.position[0], y: this.props.position[1] }}
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
  handleMouseOver() {
    if (this.props.locked || this.state.dragging) return;
    this.setState({
      color: this.state.hoverColor
    });
  }
  handleMouseOut() {
    if (this.props.locked || this.state.dragging) return;
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
  handleDragStop(e: MouseEvent, draggableData: DraggableData) {
    this.setState({
      dragging: false,
      color: this.props.color
    });
    this.props.onDragStop(draggableData);
  }
}
