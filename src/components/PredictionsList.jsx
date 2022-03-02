import "./predictions.css";
import React, { Component } from "react";

import Prediction from "./Prediction";

class PredictionsList extends Component {
  render = () => {
    const { predictions } = this.props;
    return (
      <div className="predictions-list-wrapper">
        <h3>Generated data</h3>
        <div className="predictions-list">
          <p className="explanation">
            Use <strong>Ctrl + Click</strong> to generate new data on the
            canvas.
          </p>
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
