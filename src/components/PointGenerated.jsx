import "./point.css";
import React, { Component } from "react";

class PointGenerated extends Component {
  render = () => {
    const { yPos, xPos, size, innerHTML } = this.props;
    const borderWidth = Math.max(2, size * 0.1);
    let hideClass;
    if (innerHTML===undefined) {
        hideClass = 'hidden';
    } else {
        hideClass = '';
    }
    return (
      <div
        id="point-generated"
        className={`point ${hideClass}`}
        style={{
          top: `${Number.parseInt(yPos, 10) - size / 2}px`,
          left: `${Number.parseInt(xPos, 10) - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${0.5 * size}px`,
        }}
      >
          <img src={innerHTML} alt="prediction" className='img-fluid' style={{border: `${borderWidth}px solid #edbd00`}} />
      </div>
    );
  };
}

export default PointGenerated;
