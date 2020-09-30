import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import DataTable from 'react-data-table-component';

export const OrderPage = () => {
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/order'
  }, { manual: true })

  useEffect(() => {
    refetch()
  },[])

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <DataTable
            progressPending={loading}
            data={data}
            pagination={true}
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
                cell: (row) => row.Customer.Customers.length == 0 ? 'N/A': `${row.Customer.Customers[0].firstname} ${row.Customer.Customers[0].lastname}`
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
