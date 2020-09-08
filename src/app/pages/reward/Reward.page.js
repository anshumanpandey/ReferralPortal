import React, { useState, useEffect } from "react";
import useAxios from 'axios-hooks'
import DataTable from 'react-data-table-component';
import GiftListModal from "./GiftListModal";
import { connect } from "react-redux";

export const Reward = (props) => {
  const [showModal, setShowModal] = useState(false);
  let url = '/reward'
  if (props.user.role == "Super_admin") {
    url = "/reward/admin/rewards"
  }
  const [{ data, loading, error }, refetch] = useAxios({
    url: url
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
              { name: 'Customer Name', cell: (row) => `${row.Customer.firstname} ${row.Customer.lastname}` },
              { name: 'Stored Credit', selector: 'storeCredit', cell: (r) => r.storeCredit ? r.storeCredit: 'N/A' },
              { name: 'Free Product', selector: 'freeProduct', cell: (r) => r.FreeProduct.length != 0 ? r.FreeProduct[0].name: 'N/A' },
              { name: 'Reward Type', cell: (row) => row.rewardType != "Gift" ? row.rewardType : <p style={{ textDecoration: 'underline', color: 'blue', cursor: "pointer"}} onClick={() => setShowModal(row.Gifts)}>{row.rewardType}</p>},
              { name: 'Discount Amount', selector: 'discountAmount', cell: (r) => r.discountAmount ? r.discountAmount: 'N/A' },
              { name: 'Discount Unit', selector: 'discountUnit', cell: (r) => r.discountUnit ? r.discountUnit: 'N/A' },
              { name: 'Free Shipping', selector: 'freeDeliver', cell: (row) => row.freeDeliver ? "Yes": "No"},
            ]}
          />
        </div>
      </div>
      {showModal && <GiftListModal gifts={showModal} open={showModal !== false} onHide={() => setShowModal(false)} />}
    </>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(Reward);
