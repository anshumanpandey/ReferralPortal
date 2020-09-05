import React, { useMemo, useEffect, useState } from "react";
import { useSelector, connect } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../partials/content/Portlet";
import { DatePicker } from "@material-ui/pickers";
import OrderStatisticsChart from "../../widgets/OrderStatisticsChart";
import LatestUpdates from "../../widgets/LatestUpdates";
import useAxios from 'axios-hooks'
import { metronic } from "../../../_metronic";
import QuickStatsChart from "../../widgets/QuickStatsChart";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Button } from "@material-ui/core";
import { useDidUpdateEffect } from "../../utils/useDidUpdateEffect";
import { useParams } from "react-router-dom";
const queryString = require('query-string');

function Dashboard({ user }) {
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

  const params = useParams()
  const [resumeFor, setResumeFor] = useState("ALL")
  const [resumeForPartner, setResumeForPartner] = useState("ALL")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [{ data, loading, error }, refetch] = useAxios({
    url: `/referralProgram/resume?for=${resumeFor == "ALL" ? "" : resumeFor}`
  }, { manual: true })

  const [programsReq, getPrograms] = useAxios({
    url: `/referralProgram/`
  })

  const [getPartnersReq, getPartners] = useAxios({
    url: `/user/getPartners`
  }, { manual: true })

  useEffect(() => {
    if (params.programId) {
      fetchWithQueries()
    }
  }, [params.programId])

  useEffect(() => {
    console.log("use effect")
    if (user.role == "Super_admin") {
      getPartners()
    } else {
      setResumeForPartner(user.id)
    }
    fetchWithQueries(user.id)
  }, [])

  const fetchWithQueries = (forProgramId, userId) => {
    const queries = {}

    if (forProgramId) {
      queries.for = forProgramId
    } else if (resumeFor != "ALL") {
      queries.for = resumeFor
    }

    if (userId) {
      queries.forPartner = userId
    }else if (resumeForPartner != "ALL") {
      queries.forPartner = resumeForPartner
    }

    if (startDate && endDate) {
      queries.from = startDate.getTime() / 1000
      queries.to = endDate.getTime() / 1000
    }

    const urlQuery = queryString.stringify(queries);

    refetch({ url: `/referralProgram/resume?${urlQuery}` })
  }

  let body = <CircularProgress />

  if (!loading) {
    body = (
      <>
        <div className="col-sm-12 col-md-12 col-lg-12" style={{ marginBottom: '1rem' }}>
          <Card>
            <CardContent style={{ display: 'flex' }}>
              {user.role == "Super_admin" && (
                <div style={{ width: '100%', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                  {getPartnersReq.loading && (
                    <CircularProgress />
                  )}
                  {!getPartnersReq.loading && (
                    <FormControl fullWidth={true}>
                      <InputLabel id="demo-simple-select-label">Partner</InputLabel>
                      <Select
                        fullWidth={true}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={resumeForPartner}
                        onChange={(e) => setResumeForPartner(e.target.value)}
                      >
                        <MenuItem value={"ALL"}>All</MenuItem>
                        {getPartnersReq.data?.map(p => {
                          return <MenuItem value={p.id}>{p.companyName}</MenuItem>
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
              )}

              <div style={{ width: '100%', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                {programsReq.loading && (
                  <CircularProgress />
                )}
                {!programsReq.loading && (
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-label">Program</InputLabel>
                    <Select
                      fullWidth={true}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={resumeFor}
                      onChange={(e) => setResumeFor(e.target.value)}
                    >
                      <MenuItem value={"ALL"}>All</MenuItem>
                      {programsReq.data?.filter(p => {
                        if (resumeForPartner != "ALL") {
                          return p.UserId == resumeForPartner
                        }
                        return true
                      }).map(p => {
                        return <MenuItem value={p.id}>{p.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                )}
              </div>
              <div style={{ width: '100%', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <DatePicker
                  fullWidth={true}
                  label="Show result from"
                  placeholder="End Date"
                  autoOk
                  disableToolbar
                  variant="inline"
                  emptyLabel=""
                  value={startDate}
                  onChange={(d) => setStartDate(d)}
                />
              </div>
              <div style={{ width: '100%', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <DatePicker
                  fullWidth={true}
                  label="To"
                  placeholder="End Date"
                  autoOk
                  disableToolbar
                  variant="inline"
                  emptyLabel=""
                  value={endDate}
                  onChange={(d) => setEndDate(d)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', width: 'auto' }}>
                <Button onClick={() => {
                  fetchWithQueries()
                }} >Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
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

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={data?.sponsors}
                desc="Sponsor"
                data={chartOptions.chart1.data}
                color={chartOptions.chart1.color}
                border={chartOptions.chart1.border}
              />
            </PortletBody>
          </Portlet>
          <div className="kt-space-20" />

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
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

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={`${data?.averageCartNewCustomer}€`}
                desc="Average cart of new customer"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>
          <div className="kt-space-20" />

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={`${data?.totalRevenueNewCustomerReferred}€`}
                desc="Total revenue from new customer referred"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>
          <div className="kt-space-20" />

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={`${data?.totalRevenueFromExistingCustomerUsingStoredCredit}€`}
                desc="Total revenue from existing customer using stored credit"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>
          <div className="kt-space-20" />

        </div>

        <div className="col-sm-12 col-md-12 col-lg-4">
          <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand" style={{ height: '90%' }}>
            <PortletBody fluid={true}>
              <QuickStatsChart
                value={`${data?.totalRevenue}€`}
                desc="Total revenue"
                data={chartOptions.chart2.data}
                color={chartOptions.chart2.color}
                border={chartOptions.chart2.border}
              />
            </PortletBody>
          </Portlet>

          <div className="kt-space-20" />
        </div>
        <div className="col-xl-6">
          <Portlet fluidHeight={true}>
            <PortletHeader
              title="Store Credit"
            />

            <PortletBody>
              <OrderStatisticsChart totalUsedCredits={data?.totalUsedCredits} totalUnusedCredits={data?.totalUnusedCredits} />
            </PortletBody>
          </Portlet>
        </div>
        <div className="col-xl-6">
          <LatestUpdates leaderboard={data?.leaderboard} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="row row-full-height">
            {body}
          </div>
        </div>
      </div>

    </>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(Dashboard);
