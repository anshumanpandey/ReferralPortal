import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Portlet,
  PortletBody,
} from "../../partials/content/Portlet";
import useAxios from 'axios-hooks'
import { metronic } from "../../../_metronic";
import QuickStatsChart from "../../widgets/QuickStatsChart";
import { CircularProgress } from "@material-ui/core";

export default function Dashboard() {
  const { brandColor, dangerColor, successColor, primaryColor } = useSelector(
    state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      )
    })
  );

  const chartOptions = useMemo(
    () => ({
      chart1: {
        data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
        color: brandColor,
        border: 3
      },

      chart2: {
        data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
        color: dangerColor,
        border: 3
      },

      chart3: {
        data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
        color: successColor,
        border: 3
      },

      chart4: {
        data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
        color: primaryColor,
        border: 3
      }
    }),
    [brandColor, dangerColor, primaryColor, successColor]
  );

  const [{ data, loading, error }, refetch] = useAxios({
    url: '/referralProgram/resume'
  }, { manual: true })

  useEffect(() => {
    refetch()
  }, [])

  let body = <CircularProgress />

  if (!loading) {
    body = (
      <>
        <div className="col-sm-12 col-md-12 col-lg-6">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={data?.customersAmount}
                desc="User"
                data={chartOptions.chart1.data}
                color={chartOptions.chart1.color}
                border={chartOptions.chart1.border}
              />
            </PortletBody>
          </Portlet>

          <div className="kt-space-20" />

          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={data?.customersAmount}
                desc="User"
                data={chartOptions.chart1.data}
                color={chartOptions.chart1.color}
                border={chartOptions.chart1.border}
              />
            </PortletBody>
          </Portlet>
        </div>

        <div className="col-sm-12 col-md-12 col-lg-6">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={data?.credits}
                desc="Total credits"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>

          <div className="kt-space-20" />

          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={data?.credits}
                desc="Total credits"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-6">
          <div className="row row-full-height">
            {body}
          </div>
        </div>
      </div>

    </>
  );
}
