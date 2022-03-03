import React, { Component } from "react";
import Canvas from "./components/Canvas";
import Dropdown from "./components/Dropdown";
import Slider from "./components/Slider";
import PredictionsList from "./components/PredictionsList";
import { rotationMatrix } from "mathjs";
import * as ut from "./utils";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        { value: "mnist", label: "MNIST" },
        { value: "fashion-mnist", label: "Fashion-MNIST" },
      ],
      dataset: "mnist",
      zoom: 300,
      pointSize: 18,
      projectionOptions: [
        { value: "ortho", label: "Orthographic" },
        { value: "stereo", label: "Stereographic" },
        { value: "cylindre", label: "Cylindrical" },
      ],
      projection: "ortho",
      baseMatrixR: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      tpg: [0, 0],
      predictions: [],
      predictionID: 0,
    };
  }

  fetchDataSet = () => {
    const { dataset } = this.state;
    const { PUBLIC_URL } = process.env;
    fetch(`${PUBLIC_URL}/datasets/${dataset}/coordinates.json`)
      .then((r) => r.json())
      .then((data) => {
        this.setState({ data }, this.projectData);
      });
  };

  switchDataset = (dataset) => {
    const point = document.getElementById("point-generated");
    point.classList.add("hidden");
    this.setState({ dataset }, this.fetchDataSet);
  };

  switchProjection = (projection) => {
    this.setState({ projection }, this.projectData);
  };

  setZoomingTrue = () => {
    this.setState({ zooming: true });
  };

  setZoomingFalse = () => {
    this.setState({ zooming: false });
  };

  zoomSlider = (z) => {
    const zoom = Math.max(150, z);
    const pointSize = Number.parseInt(0.06 * zoom, 10);
    this.setState({ zoom, pointSize }, this.manageZoom);
  };

  zoomWheel = (e) => {
    const zoom = Math.max(150, this.state.zoom + e.deltaY);
    const pointSize = Number.parseInt(0.06 * zoom, 10);
    this.setState({ zoom, pointSize }, this.manageZoom);
  };

  manageZoom = () => {
    const { zoom, canvasSizeX, canvasSizeY, projected } = this.state;
    const children = [];
    Object.values(projected).forEach((element) => {
      const { id, zIndex, data } = element;

      const [X, Y] = data;
      const posX = X * zoom + canvasSizeX / 2;
      const posY = Y * zoom + canvasSizeY / 2;
      if (
        posX >= 0 &&
        posY >= 0 &&
        posX <= canvasSizeX &&
        posY <= canvasSizeY
      ) {
        children.push({ id, posX, posY, zIndex });
      }
    });
    this.setState({ children });

    const [Xp, Yp] = this.state.projectedChild;
    const xPosGenerated = Xp * zoom + canvasSizeX / 2;
    const yPosGenerated = Yp * zoom + canvasSizeY / 2;
    const generatedChild = { xPosGenerated, yPosGenerated };
    this.setState({ generatedChild });
  };

  projectData = () => {
    const { data, projection, tpg } = this.state;
    const projected = [];
    if (data) {
      for (const [id, tp] of Object.entries(data)) {
        let dataProjected;
        switch (projection) {
          case "ortho":
            dataProjected = ut.orthoProjection(tp);
            break;
          case "stereo":
            dataProjected = ut.stereoProjection(ut.spher2cart(tp));
            break;
          case "cylindre":
            dataProjected = ut.equalAreaProjection(tp);
            break;
          default:
            dataProjected = [];
        }
        projected.push({ id: id, data: dataProjected });
      }
      let projectedChild;
      switch (projection) {
        case "ortho":
          projectedChild = ut.orthoProjection(tpg);
          break;
        case "stereo":
          projectedChild = ut.stereoProjection(ut.spher2cart(tpg));
          break;
        case "cylindre":
          projectedChild = ut.equalAreaProjection(tpg);
          break;
        default:
          projectedChild = [];
      }
      this.setState({ projected, projectedChild }, this.manageZoom);
    }
  };

  getXYZ = (clickX, clickY) => {
    const { zoom, canvasSizeX, canvasSizeY, projection } = this.state;
    const XY = [
      (clickX - canvasSizeX / 2) / zoom,
      (clickY - canvasSizeY / 2) / zoom,
    ];
    let xyz;
    switch (projection) {
      case "ortho":
        xyz = ut.spher2cart(ut.invOrthoProjection(XY));
        break;
      case "stereo":
        xyz = ut.invStereoProjection(XY);
        break;
      case "cylindre":
        xyz = ut.spher2cart(ut.invEqualAreaProjection(XY));
        break;
      default:
        xyz = [];
    }
    return xyz;
  };

  panView = (e) => {
    const { moving, xyzOrigin, data, baseMatrixR, tpg } = this.state;
    if (moving) {
      const micro = document.getElementById("tooltip");
      micro.classList.add("invisible");

      const xyz = this.getXYZ(e.clientX, e.clientY);
      if (ut.arraysEqual(xyz, xyzOrigin)) {
        return;
      }
      const cvNormed = ut.crossVectorNormed(xyzOrigin, xyz);
      const angle = ut.angleBetweenVectors(xyz, xyzOrigin);
      const matrixR = rotationMatrix(angle, cvNormed);

      const newData = {};
      for (const [id, tp] of Object.entries(data)) {
        newData[`${id}`] = ut.cart2spher(
          ut.matrixRot(matrixR, ut.spher2cart(tp))
        );
      }

      const newTpGenerated = ut.cart2spher(
        ut.matrixRot(matrixR, ut.spher2cart(tpg))
      );

      const newBaseMatrixR = ut.matrixMul(baseMatrixR, matrixR);

      this.setState(
        {
          data: newData,
          matrixR: matrixR,
          xyzOrigin: xyz,
          baseMatrixR: newBaseMatrixR,
          tpg: newTpGenerated,
        },
        this.projectData
      );
    }
  };

  downListener = (e) => {
    if (window.event.ctrlKey) {
      this.createNewPoint(e);
    }
    if (this.state.zooming) {
      return;
    }
    document.getElementById("canvas").style.cursor = "grabbing";
    const xyz = this.getXYZ(e.clientX, e.clientY);
    this.setState({ moving: true, xyzOrigin: xyz });
  };

  createNewPoint = (e) => {
    const { baseMatrixR, dataset } = this.state;
    const xyz = this.getXYZ(e.clientX, e.clientY);
    const tpg = ut.cart2spher(xyz);
    const baseInverseRot = ut.matrixInv(baseMatrixR);
    const [x, y, z] = ut.matrixRot(baseInverseRot, xyz);
    fetch(`/predict/${dataset}/${x}/${y}/${z}`)
      .then((r) => r.text())
      .then((imageTag) => {
        const { predictionID } = this.state;
        const newPrediction = {
          id: predictionID,
          innerHTML: imageTag,
        };
        this.setState({
          predictionID: predictionID + 1,
          predictions: [...this.state.predictions, newPrediction],
        });
        this.setState({ tpg, imageTag }, this.projectData);
        const point = document.getElementById("point-generated");
        point.classList.remove("hidden");
      });
  };

  upListener = (e) => {
    e.preventDefault();
    document.getElementById("canvas").style.cursor = "grab";
    this.setState({ moving: false });
  };

  adjustCanvasSize = () => {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const canvasSizeX = rect.width;
    const canvasSizeY = rect.height;
    this.setState({ canvasSizeX, canvasSizeY }, this.projectData);
  };

  setupEventListeners = () => {
    // Add event listeners
    window.addEventListener("resize", this.adjustCanvasSize);

    // Zoom
    document
      .getElementById("canvas")
      .addEventListener("wheel", this.zoomWheel, { passive: true });

    // PAN OVER CANVAS EVENTS
    document
      .getElementById("canvas")
      .addEventListener("pointerdown", this.downListener);

    document
      .getElementById("canvas")
      .addEventListener("pointermove", this.panView);

    document
      .getElementById("canvas")
      .addEventListener("pointerup", this.upListener);
  };

  componentDidMount = () => {
    // Fetch data
    this.fetchDataSet();

    // Adjust canvas width to full-screen
    this.adjustCanvasSize();

    // Set up event listeners
    this.setupEventListeners();
  };

  render = () => {
    const {
      options,
      dataset,
      pointSize,
      children,
      projectionOptions,
      imageTag,
      generatedChild,
    } = this.state;
    return (
      <div className="App">
        <div className="canvas-wrapper">
          <Canvas
            dataset={dataset}
            pointSize={pointSize}
            children={children}
            imageTag={imageTag}
            generatedChild={generatedChild}
          />
        </div>

        <div className="side-pannel">
          <p className="learn">
            Learn more about this project{" "}
            <a
              href="https://github.com/MalloryWittwer/embedding-visualizer"
              target="_blank"
            >
              here
            </a>
            .
          </p>
          <div className="dropdown-wrapper">
            <Dropdown
              label={"Dataset"}
              options={options}
              actionFnct={this.switchDataset}
              defaultValue={{ value: "mnist", label: "MNIST" }}
            />
            <Dropdown
              label={"Projection"}
              options={projectionOptions}
              actionFnct={this.switchProjection}
              defaultValue={{ value: "ortho", label: "Orthographic" }}
            />
            <div className="zoom-wrapper">
              <Slider
                label="Zoom"
                actionFnct={this.zoomSlider}
                signalZoomActive={this.setZoomingTrue}
                signalZoomDone={this.setZoomingFalse}
                handle="zoom-slider"
                min={10}
                max={2000}
                step={10}
                default={300}
              />
            </div>
          </div>
          <PredictionsList predictions={this.state.predictions} />
        </div>
        <div id="credits">
          <a href="https://github.com/MalloryWittwer/embedding-visualizer">
            <img
              src={`${process.env.PUBLIC_URL}/github.png`}
              alt="git"
              id="github"
            />
          </a>
        </div>
      </div>
    );
  };
}

export default App;
