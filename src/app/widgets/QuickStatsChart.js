import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../_metronic";

export default function QuickStatsChart({
  value,
  desc,

  // array of numbers
  data,
  // chart line color
  color,
  // chart line size
  border
}) {
  const canvasRef = useRef();
  const { pointHoverBackgroundColor } = useSelector(state => ({
    pointHoverBackgroundColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.danger"
    )
  }));

  return (
    <div className="kt-widget26">
      <div className="kt-widget26__content">
        <span className="kt-widget26__number">{value}</span>
        <span className="kt-widget26__desc">{desc}</span>
      </div>
    </div>
  );
}
