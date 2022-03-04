import React, { Component } from "react";
import Point from "./Point";
import Tooltip from "./Tooltip";
import PointGenerated from "./PointGenerated";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = { activeID: 0 };
  }

  keyPressListener = (e) => {
    if (e.code === 'ControlLeft') {
      document.getElementById('canvas').style.cursor = 'crosshair';
    }
  };

  keyUpListener = (e) => {
    document.getElementById('canvas').style.cursor = 'grab';
  }

  handleMouseEnter = (e) => {
    document.addEventListener('keydown', this.keyPressListener);
    document.addEventListener('keyup', this.keyUpListener);
  };

  handleMouseLeave = (e) => {
    document.removeEventListener('keydown', this.keyPressListener);
    document.removeEventListener('keyup', this.keyUpListener);
  };

  centerOnID = (activeID) => {
    this.setState({ activeID });
  };

  render() {
    const { dataset, pointSize, children, imageTag, generatedChild } =
      this.props;
    const { activeID } = this.state;
    if (children) {
      const { xPosGenerated, yPosGenerated } = generatedChild;
      return (
        <div 
          id="canvas"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {children.map((child) => {
            const { id, posX, posY, zIndex } = child;
            return (
              <Point
                actionFnct={this.centerOnID}
                key={id}
                id={id}
                xPos={posX}
                yPos={posY}
                size={pointSize}
                zIndex={zIndex}
                dataset={dataset}
              />
            );
          })}
          <Tooltip filename={activeID} dataset={dataset} />
          <PointGenerated
            innerHTML={imageTag}
            xPos={xPosGenerated}
            yPos={yPosGenerated}
            size={pointSize}
          />
        </div>
      );
    } else {
      return <div id="canvas"></div>;
    }
  }
}

export default Canvas;
