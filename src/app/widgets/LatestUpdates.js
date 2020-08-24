/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import PortletHeaderDropdown from "../partials/content/CustomDropdowns/PortletHeaderDropdown";

export default function LatestUpdates() {
  return (
    <>
      <div className="kt-portlet kt-portlet--height-fluid">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">Leaderboard</h3>
          </div>
        </div>
        <div className="kt-portlet__body">
          <div className="kt-widget4">
            <div className="kt-widget4__item">
              <a
                className="kt-widget4__title"
                href="https://keenthemes.com.my/metronic"
              >
                Eminem
              </a>
              <span className="kt-widget4__number kt-font-success">10</span>
            </div>
            <div className="kt-widget4__item">
              <a
                className="kt-widget4__title"
                href="https://keenthemes.com.my/metronic"
              >
                G-Eazy
              </a>
              <span className="kt-widget4__number kt-font-success">10</span>
            </div>
            <div className="kt-widget4__item">
              <a
                className="kt-widget4__title"
                href="https://keenthemes.com.my/metronic"
              >
                Tupac
              </a>
              <span className="kt-widget4__number kt-font-success">10</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
