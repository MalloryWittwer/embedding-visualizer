import "./tooltip.css";

export default function Tooltip(props) {
  return (
    <div className="tooltip invisible" id="tooltip">
      <img
        src={`${process.env.PUBLIC_URL}/datasets/${props.dataset}/images/${props.filename}.png`}
        alt="tooltip"
      />
      <div id="triangle"></div>
    </div>
  );
}
