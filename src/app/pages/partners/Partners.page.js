import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import { Button, TextField } from "@material-ui/core";
import DataTable from 'react-data-table-component';
import EditIcon from '@material-ui/icons/Edit';
import PartnerForm from "./PartnerForm";

export const Partners = () => {
  const [valueToSearch, setValueToSearch] = useState("");
  const [dataToShow, setDataToShow] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/user/getPartners'
  }, { manual: true })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (data && !loading) {
      setDataToShow(data)
    }
  }, [loading])

  useEffect(() => {
    if (data && !loading) {
      if (valueToSearch) {
        setDataToShow(data.filter(r => r.companyName.includes(valueToSearch)))
      } else {
        setDataToShow(data)
      }
    }
  }, [valueToSearch])

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <DataTable
            pagination={true}
            actions={
              <div style={{ flexDirection: 'row', display: 'flex'}}>
                <TextField
                  size={"small"}
                  placeholder="Customer Name"
                  margin="normal"
                  value={valueToSearch}
                  onChange={(e) => setValueToSearch(e.target.value)}
                />
                <Button
                  style={{ alignSelf: 'center' }}
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModal({})}
                >
                  New
              </Button>
              </div>
            }
            progressPending={loading}
            data={dataToShow}
            columns={[
              { name: 'Company Name', selector: 'companyName' },
              { name: 'Addres', selector: 'address' },
              { name: 'Email', selector: 'email' },
              { name: 'Plugin Key', selector: 'pluginKey' },
              { name: 'Is Disabled', selector: 'isDisabled', cell: (row) => row.isDisabled ? "Yes" : "No" },
              { name: 'Edit', cell: (row) => <EditIcon onClick={() => setShowModal(row)} style={{ cursor: "pointer" }} /> },
            ]}
          />
        </div>
      </div>
      {showModal && <PartnerForm edit={showModal.companyName} partner={showModal} onHide={(action) => {
        setShowModal(false)
        if (action == "CREATED") refetch()
      }} />}
    </>
  );
}

export default Partners;
