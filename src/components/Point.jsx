import "./point.css";
import React, { Component } from "react";

class Point extends Component {
  handleMouseEnter = (e) => {
    const { yPos, xPos, size, id, actionFnct } = this.props;
    e.preventDefault();
    e.currentTarget.classList.add("hovered-point");
    actionFnct(id);
    const micro = document.getElementById("tooltip");
    micro.classList.remove("invisible");
    micro.style.top = `${Number.parseInt(yPos, 10) - 220 - size / 2}px`;
    micro.style.left = `${Number.parseInt(xPos, 10) - 102}px`;
    const triangle = document.getElementById("triangle");
    triangle.style.borderTopColor = '#282c34';
  };

  handleMouseLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("hovered-point");
    document.getElementById("tooltip").classList.add("invisible");
  };

  render = () => {
    const { id, yPos, xPos, size, dataset } = this.props;
    return (
      <div
        className="point"
        id={id}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{
          top: `${Number.parseInt(yPos, 10) - size / 2}px`,
          left: `${Number.parseInt(xPos, 10) - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${0.5 * size}px`,
          backgroundImage: `url(${process.env.PUBLIC_URL}/datasets/${dataset}/images/${id}.png)`,
        }}
      ></div>
    );
  };
}

export default Point;
