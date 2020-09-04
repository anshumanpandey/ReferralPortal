import React, { useEffect, useMemo, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../_metronic";

export default function OrderStatisticsChart({ totalUsedCredits, totalUnusedCredits }) {
  const ref = useRef();
  const { brandColor, shape2Color, shape3Color } = useSelector(state => ({
    brandColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.brand"
    ),
    shape2Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.2"
    ),
    shape3Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.3"
    )
  }));

  return (
    <div className="kt-widget12">
      <div className="kt-widget12__content">
        <div className="kt-widget12__item">
          <div className="kt-widget12__info">
            <span className="kt-widget12__desc">Total Store credit used</span>
            <span className="kt-widget12__value">{totalUsedCredits}</span>
          </div>
          <div className="kt-widget12__info">
            <span className="kt-widget12__desc">Store credit unused</span>
            <span className="kt-widget12__value">{totalUnusedCredits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
