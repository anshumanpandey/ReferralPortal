import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { TextField } from "@material-ui/core";

export const OrderPage = () => {
  const [valueToSearch, setValueToSearch] = useState("");
  const [dataToShow, setDataToShow] = useState([]);
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/order'
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
      if (valueToSearch){
        setDataToShow(data.filter(r => r.Customer.firstname.includes(valueToSearch)))
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
            progressPending={loading}
            data={dataToShow}
            pagination={true}
            noHeader={true}
            subHeader={true}
            subHeaderComponent={
              <div>
                <TextField
                  size={"small"}
                  placeholder="Customer Name"
                  margin="normal"
                  value={valueToSearch}
                  onChange={(e) => setValueToSearch(e.target.value)}
                />
              </div>
            }
            columns={[
              { sortable: true, name: 'Order Amount', selector: 'orderAmount' },
              {
                sortable: true,
                name: 'Customer Name',
                selector: 'Customer.firstname',
                format: (row) => `${row.Customer.firstname} ${row.Customer.lastname}`
              },
              {
                sortable: true,
                name: 'Referred By',
                cell: (row) => row.Customer.Customers.length == 0 ? 'N/A' : `${row.Customer.Customers[0].firstname} ${row.Customer.Customers[0].lastname}`
              },
              {
                sortable: true,
                name: 'Referral Program',
                selector: "ReferralProgram.name"
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default OrderPage;
