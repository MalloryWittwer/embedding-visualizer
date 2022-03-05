import "./predictions.css";
import React, { Component } from "react";

import Prediction from "./Prediction";

class PredictionsList extends Component {
  render = () => {
    const { predictions } = this.props;
    return (
      <div className="predictions-list-wrapper">
          <p className="explanation">
            Use <strong>Ctrl + Click</strong> to generate new data on the
            canvas.
          </p>
        <div className="predictions-list">
          {predictions.map((pred) => {
            const { innerHTML, id } = pred;
            return <Prediction innerHTML={innerHTML} key={id} />;
          })}
        </div>
      </div>
    );
  };
}

export default PredictionsList;
