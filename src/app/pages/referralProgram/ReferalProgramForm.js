import React from "react";
import { TextField, Checkbox, FormControlLabel, Button, makeStyles } from "@material-ui/core";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Formik, FieldArray } from "formik";
import useAxios from 'axios-hooks'
import { DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles({
  root: {
    minWidth: '30px'
  },
});

export const ReferalProgramForm = ({ onHide, referralProgram, edit }) => {
  const classes = useStyles();
  const [{ data, loading, error }, doPost] = useAxios({
    url: '/referralProgram/',
    method: 'POST'
  }, { manual: true })

  return (
    <>
      <Dialog fullWidth onClose={onHide} open={true}>
        <DialogTitle id="simple-dialog-title">
          {!edit ? "Create a Referral Program" : `Edit ${referralProgram.name}`}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: referralProgram.id,
              name: referralProgram.name,
              endDate: referralProgram.endDate || new Date(),
              isActive: referralProgram.isActive || false,
              SocialShares: referralProgram.SocialShares || [],
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
                        fullWidth
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

                  <div className="form-group" style={{ margin: 0 }}>
                    <FormControlLabel
                      control={<Checkbox checked={values.isActive} onChange={() => {
                        setFieldValue("isActive", !values.isActive)
                      }} name="checkedA" />}
                      label="Is Active"
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Email Template"
                      multiline={true}
                      rows={3}
                      margin="normal"
                      className="kt-width-full"
                      name="emailTemplate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.emailTemplate}
                      helperText={touched.emailTemplate && errors.emailTemplate}
                      error={Boolean(touched.emailTemplate && errors.emailTemplate)}
                    />
                  </div>
                  <FieldArray
                    name="SocialShares"
                    render={arrayHelpers => (
                      <div>
                        {values.SocialShares && values.SocialShares.length > 0 ? (
                          values.SocialShares.map((friend, index) => (
                            <div key={index} className="row">
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-md-5">
                                <TextField
                                  style={{ marginBottom: 0 }}
                                  label="Url to open"
                                  margin="normal"
                                  className="kt-width-full"
                                  name={`SocialShares[${index}].url`}
                                  onBlur={handleBlur}
                                  onChange={(e) => arrayHelpers.replace(index, { ...friend, url: e.target.value })}
                                  value={friend.url}
                                />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-md-5">
                                <TextField
                                  style={{ marginBottom: 0 }}
                                  label="Image url"
                                  margin="normal"
                                  className="kt-width-full"
                                  name={`SocialShares[${index}].imgUrl`}
                                  onBlur={handleBlur}
                                  onChange={(e) => arrayHelpers.replace(index, { ...friend, imgUrl: e.target.value })}
                                  value={friend.imgUrl}
                                />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-end' }} className="col-md-1">
                                <Button
                                  classes={{ root: classes.root }}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                >-</Button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-end' }} className="col-md-1">
                                <Button
                                  classes={{ root: classes.root }}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                >+</Button>
                              </div>
                            </div>
                          ))
                        ) : (
                            <Button onClick={() => arrayHelpers.push({ url: "", imgUrl: "" })} variant="outlined" color="primary">
                              Add a share link
                            </Button>
                          )}
                      </div>

                    )}

                  />

                  <div style={{ marginTop: '1rem' }} className="kt-login__actions">
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
