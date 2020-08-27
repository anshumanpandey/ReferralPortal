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
            columns={[
              { name: 'Order Amount', selector: 'orderAmount' },
              { name: 'Promotion Method', selector: 'promotionMethod' },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default OrderPage;
