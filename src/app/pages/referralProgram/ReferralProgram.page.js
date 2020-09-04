import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import { Button } from "@material-ui/core";
import DataTable from 'react-data-table-component';
import EditIcon from '@material-ui/icons/Edit';
import PartnerForm from "./ReferalProgramForm";
import { useHistory } from "react-router-dom";

export const ReferralProgram = () => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/referralProgram'
  },{ manual: true })

  useEffect(() => {
    refetch()
  },[])

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <DataTable
            actions={
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowModal({})}
              >
                New
              </Button>
            }
            progressPending={loading}
            data={data}
            columns={[
              { name: 'Name', selector: 'name' },
              { name: 'End Date', cell: (row) => row.endDate ? row.endDate.toString().split("T")[0] : "No" },
              { name: 'Is Active', cell: (row) => row.isActive ? "Yes": "No" },
              { name: 'See Results', cell: (row) => <p style={{ textDecoration: "underline", color: "blue", cursor: 'pointer'}} onClick={() => history.push(`/dashboard/${row.id}`)}>See Results</p> },
              { name: 'Edit', cell: (row) => <EditIcon onClick={() => setShowModal(row)} style={{ cursor: "pointer"}} /> },
            ]}
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

export default ReferralProgram;
