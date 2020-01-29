import React, { Ref } from "react";
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
    svgRef: Ref<SVGElement>;
  },
  {
    color: string;
    dragging: boolean;
    hovering: boolean;
  }
> {
  hoverColor: string;
  dragColor: string;
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
      dragging: false,
      hovering: false
    };
    this.hoverColor = "rgb(100%, 100%, 44.1%)";
    this.dragColor = "yellow";
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
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
          className={classnames({
            "puzzle-piece-group": true,
            dragging: this.state.dragging,
            hovering: this.state.hovering
          })}
          onMouseEnter={this.handleMouseEnter}
          onMouseOut={this.handleMouseOut}
        >
          <rect></rect>
          {pathEls}
        </g>
      </Draggable>
    );
  }
  handleMouseEnter() {
    if (!this.state.dragging) {
      this.setState({
        hovering: true
      });
    }
  }
  handleMouseOut() {
    if (!this.state.dragging) {
      this.setState({
        hovering: false
      });
    }
  }
  handleDragStart() {
    this.setState({
      dragging: true
    });
    this.props.onDragStart(this.props.index);
  }
  handleDragStop(e: MouseEvent, draggableData: DraggableData) {
    this.setState({
      dragging: false
    });
    this.props.onDragStop(this.props.index, draggableData);
  }
}
