import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import { Button } from "@material-ui/core";
import DataTable from 'react-data-table-component';
import EditIcon from '@material-ui/icons/Edit';

export const OrderPage = () => {
  const [showModal, setShowModal] = useState(false);
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
              { name: 'Customer', selector: 'customer' },
              { name: 'Sponsor', selector: 'sponsor' },
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
