import "./point.css";
import React, { Component } from "react";

class Prediction extends Component {
  render = () => {
    const { innerHTML } = this.props;
    return (
      <div className="prediction">
        <img src={innerHTML} alt="pred-img" className="pred-img" />
      </div>
    );
  };
}

export default Prediction;
