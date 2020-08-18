import React from "react";
import { TextField, Checkbox, FormControlLabel, Button } from "@material-ui/core";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from "formik";
import useAxios from 'axios-hooks'
import { DatePicker } from "@material-ui/pickers";

export const ReferalProgramForm = ({ onHide, referralProgram, edit }) => {
  const [{ data, loading, error }, doPost] = useAxios({
    url: '/referralProgram/',
    method: 'POST'
  }, { manual: true })

  return (
    <>
      <Dialog onClose={onHide} open={true}>
        <DialogTitle id="simple-dialog-title">
          {!edit ? "Create a Referral Program" : `Edit ${referralProgram.name}`}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: referralProgram.id,
              name: referralProgram.name,
              endDate: referralProgram.endDate || new Date(),
              noEndDate: !referralProgram.name ? false : referralProgram && !referralProgram.endDate ? true : false
            }}
            validate={values => {
              const errors = {};

              if (!values.name) errors.name = "Field required"
              if (values.noEndDate == false) {
                if (!values.endDate) errors.endDate = "Field required"
              }

              return errors;
            }}
            onSubmit={(data, { setStatus, setSubmitting }) => {
              doPost({ data })
                .then(() => onHide("CREATED"))
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
                <form
                  autoComplete="off"
                  className="kt-form"
                  onSubmit={handleSubmit}
                >
                  {status && (
                    <div role="alert" className="alert alert-danger">
                      <div className="alert-text">{status}</div>
                    </div>
                  )}

                  <div className="form-group">
                    <TextField
                      label="Name"
                      margin="normal"
                      className="kt-width-full"
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      helperText={touched.name && errors.name}
                      error={Boolean(touched.name && errors.name)}
                    />
                  </div>

                  {values.noEndDate == false && (
                    <div className="form-group">
                      <DatePicker
                        placeholder="End Date"
                        helperText={touched.endDate && errors.endDate}
                        error={Boolean(touched.endDate && errors.endDate)}
                        autoOk
                        disableToolbar
                        variant="inline"
                        value={values.endDate}
                        onChange={(d) => setFieldValue("endDate", d)}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <FormControlLabel
                      control={<Checkbox checked={values.noEndDate} onChange={() => {
                        setFieldValue("noEndDate", !values.noEndDate)
                        setFieldValue("endDate", null)
                      }} name="checkedA" />}
                      label="No End Date"
                    />
                  </div>

                  <div className="kt-login__actions">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => onHide("CANCELLED")}
                      disabled={loading}
                    >
                      Cancel
                  </Button>
                  </div>
                </form>
              )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReferalProgramForm;
