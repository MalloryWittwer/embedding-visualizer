import "./slider.css";
import React, { Component } from "react";

class Slider extends Component {
  handleUpdate = (event) => {
    this.props.actionFnct(event.target.value);
  };

  componentDidMount() {
    const slider = document.getElementById(`${this.props.handle}`);
    slider.value = this.props.default;
  }

  handleMouseEnter = (e) => {
    e.preventDefault();
    this.props.signalZoomActive();
    document.getElementById("canvas").style.cursor = "auto";
  };

  handleMouseLeave = (e) => {
    e.preventDefault();
    this.props.signalZoomDone();
    document.getElementById("canvas").style.cursor = "grab";
  };

  render() {
    const { handle, label, min, max, step } = this.props;
    return (
      <div
        id="zoom-container"
        className="zoom-container"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <label htmlFor={handle}>{label}</label>
        <input
          type="range"
          className="range"
          name="rank"
          min={min}
          max={max}
          step={step}
          onChange={this.handleUpdate}
          id={handle}
        />
      </div>
    );
  }
}

export default Slider;