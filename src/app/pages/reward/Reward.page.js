import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import DataTable from 'react-data-table-component';
import GiftListModal from "./GiftListModal";

export const Reward = () => {
  const [showModal, setShowModal] = useState(false);
  const [{ data, loading, error }, refetch] = useAxios({
    url: '/reward'
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
              { name: 'Sponsor', selector: 'sponsor' },
              { name: 'Stored Credit', selector: 'storeCredit' },
              { name: 'Free Producr', selector: 'freeProduct' },
              { name: 'Reward Type', cell: (row) => row.rewardType != "Gift" ? row.rewardType : <p style={{ textDecoration: 'underline', color: 'blue', cursor: "pointer"}} onClick={() => setShowModal(row.Gifts)}>{row.rewardType}</p>},
              { name: 'Discount Amount', selector: 'discountAmount' },
              { name: 'Discount Unit', selector: 'discountUnit' },
              { name: 'Free Deliver', selector: 'freeDeliver', cell: (row) => row.freeDeliver ? "Yes": "No"},
            ]}
          />
        </div>
      </div>
      {showModal && <GiftListModal gifts={showModal} open={showModal !== false} onHide={() => setShowModal(false)} />}
    </>
  );
}

export default Reward;
