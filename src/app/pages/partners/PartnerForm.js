import React from "react";
import { TextField, Checkbox, FormControlLabel, Button } from "@material-ui/core";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from "formik";
import useAxios from 'axios-hooks'

export const PartnerForm = ({ onHide, partner, edit }) => {
  const [{ data, loading, error }, doPost] = useAxios({
    url: '/user/createPartner',
    method: 'POST'
  }, { manual: true })

  return (
    <>
      <Dialog fullWidth onClose={onHide} open={true}>
        <DialogTitle id="simple-dialog-title">
          {!edit ? "Create a Partner" : `Edit ${partner.companyName}`}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: partner.id,
              companyName: partner.companyName,
              address: partner.address,
              pluginKey: partner.pluginKey,
              email: partner.email,
              password: partner.password,
            }}
            validate={values => {
              const errors = {};

              if (!values.companyName) errors.companyName = "Field required"
              if (!values.address) errors.address = "Field required"
              if (!values.email) errors.email = "Field required"
              if (!values.pluginKey) errors.pluginKey = "Field required"
              if (!values.password && !edit) errors.password = "Field required"

              return errors;
            }}
            onSubmit={(data, { setStatus, setSubmitting }) => {
              doPost({ data })
                .then(() => onHide("CREATED"))
                .catch(err => err && err.response && setStatus(err.response.data.message))
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
                      label="Company Name"
                      margin="normal"
                      className="kt-width-full"
                      name="companyName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.companyName}
                      helperText={touched.companyName && errors.companyName}
                      error={Boolean(touched.companyName && errors.companyName)}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Address"
                      margin="normal"
                      className="kt-width-full"
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      helperText={touched.address && errors.address}
                      error={Boolean(touched.address && errors.address)}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Email"
                      margin="normal"
                      className="kt-width-full"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Password"
                      margin="normal"
                      className="kt-width-full"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      helperText={touched.password && errors.password}
                      error={Boolean(touched.password && errors.password)}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Plugin Key"
                      margin="normal"
                      className="kt-width-full"
                      name="pluginKey"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pluginKey}
                      helperText={touched.pluginKey && errors.pluginKey}
                      error={Boolean(touched.pluginKey && errors.pluginKey)}
                    />
                  </div>

                  <div className="form-group">
                    <FormControlLabel
                      control={<Checkbox checked={values.isDisabled} onChange={() => setFieldValue("isDisabled", !values.isDisabled)} name="checkedA" />}
                      label="Is Disabled"
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

export default PartnerForm;
