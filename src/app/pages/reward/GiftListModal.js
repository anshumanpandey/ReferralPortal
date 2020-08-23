import React from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DataTable from 'react-data-table-component';

export const GiftListModal = ({ onHide, gifts, open }) => {

  return (
    <>
      <Dialog fullWidth onClose={onHide} open={open}>
        <DialogTitle id="simple-dialog-title">Gift List</DialogTitle>
        <DialogContent>
          <DataTable
            noHeader={true}
            data={gifts}
            columns={[
              { name: 'Name', selector: 'name' },
              { name: 'Referral ID', selector: 'referralId' },
            ]}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GiftListModal;
