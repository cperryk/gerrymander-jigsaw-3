import React from "react";
import Draggable, { DraggableData } from "react-draggable";
import classnames from "classnames";

export class PuzzlePiece extends React.PureComponent<
  {
    paths: string[];
    onDragStart: (index: number) => any;
    onDragStop: (index: number, DraggableData) => any;
    color: string;
    locked: boolean;
    dragScale: number;
    position: [number, number];
    index: number;
  },
  {
    color: string;
    dragging: boolean;
  }
> {
  hoverColor: string;
  dragColor: string;
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
      dragging: false
    };
    this.hoverColor = "rgb(100%, 100%, 44.1%)";
    this.dragColor = "yellow";
  }
  render() {
    const pathEls = this.props.paths.map((path, index) => {
      return (
        <path
          d={path}
          className="puzzle-piece-path"
          fill={this.state.color}
          key={index}
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
        >
          {pathEls}
        </g>
      </Draggable>
    );
  }
  handleMouseOver() {
    if (this.props.locked || this.state.dragging) return;
    this.setState({
      color: this.hoverColor
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
      color: this.dragColor
    });
    this.props.onDragStart(this.props.index);
  }
  handleDragStop(e: MouseEvent, draggableData: DraggableData) {
    this.setState({
      dragging: false,
      color: this.props.color
    });
    this.props.onDragStop(this.props.index, draggableData);
  }
}
