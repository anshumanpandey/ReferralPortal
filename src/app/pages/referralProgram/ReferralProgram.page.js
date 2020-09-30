import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import { Button, FormControl, Select, MenuItem, InputLabel } from "@material-ui/core";
import DataTable from 'react-data-table-component';
import EditIcon from '@material-ui/icons/Edit';
import PartnerForm from "./ReferalProgramForm";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

export const ReferralProgram = ({ user }) => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);
  const [programsFor, setProgramsFor] = useState("ALL");
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/referralProgram'
  }, { manual: true })

  const [activeReq, changeActive] = useAxios({
    url: '/referralProgram/changeActiveStatus',
    method: 'POST'
  }, { manual: true })

  const [getPartnersReq, getPartners] = useAxios({
    url: `/user/getPartners`
  }, { manual: true })

  useEffect(() => {
    refetch()
    if (user.role == "Super_admin") {
      getPartners()
    }
  }, [])

  let canActivate = false

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <DataTable
            actions={
              <>
                {user.role == "Super_admin" && (
                  <FormControl fullWidth={true}>
                    <InputLabel id="demo-simple-select-label">Partner</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={programsFor}
                      onChange={(e) => setProgramsFor(e.target.value)}
                    >
                      <MenuItem value={"ALL"}>All</MenuItem>
                      {getPartnersReq.data?.map(p => {
                        return <MenuItem value={p.id}>{p.companyName}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModal({})}
                >
                  New
              </Button>
              </>
            }
            progressPending={loading || activeReq.loading}
            data={data?.filter(d => {
              if (programsFor == "ALL") return true

              return d.UserId == programsFor
            })}
            columns={[
              { sortable: true ,name: 'Name', selector: 'name' },
              { sortable: true ,name: 'End Date', selector: "endDate",format: (row) => row.endDate ? row.endDate.toString().split("T")[0] : "No" },
              {
                name: 'Is Active', cell: (row) => {
                  return (
                    <>
                      {row.isActive && (
                        <Button onClick={() => {
                          const data = { programId: row.id, isActive: false }
                          changeActive({ data })
                            .then(() => refetch())
                        }} size="small" variant="outlined" color="secondary" href="#outlined-buttons">
                          Deactivate
                        </Button>
                      )}
                      {!row.isActive && (
                        <Button onClick={() => {
                          const data = { programId: row.id, isActive: true }
                          changeActive({ data })
                            .then(() => refetch())
                        }} disabled={canActivate} size="small" variant="outlined" color="primary" href="#outlined-buttons">
                          Activate
                        </Button>
                      )}
                    </>
                  );
                }
              },
              { name: 'See Results', cell: (row) => <p style={{ textDecoration: "underline", color: "blue", cursor: 'pointer' }} onClick={() => history.push(`/dashboard/${row.id}`)}>See Results</p> },
              { name: 'Edit', cell: (row) => <EditIcon onClick={() => setShowModal(row)} style={{ cursor: "pointer" }} /> },
            ]}
            pagination={true}
          />
        </div>
      </div>
      {showModal && <PartnerForm edit={showModal.companyName} referralProgram={showModal} onHide={(action) => {
        setShowModal(false)
        if (action == "CREATED") refetch()
      }} />}
    </>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(ReferralProgram);