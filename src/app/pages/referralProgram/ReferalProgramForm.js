import React, { useEffect } from "react";
import { TextField, Checkbox, FormControlLabel, Button, makeStyles, Typography, Select, MenuItem, Radio, RadioGroup, FormHelperText } from "@material-ui/core";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { Formik, FieldArray } from "formik";
import useAxios from 'axios-hooks'
import { DatePicker } from "@material-ui/pickers";
import { connect } from "react-redux";

const REWARD_TYPE_ENUM = {
  STORED_CREDIT: "Stored_credit",
  GIFT: "Gift",
  FREE_PRODUCT: "Free_product",
  DISCOUNT: "Discount",
}

const PROMOTION_ENUM = {
  PERSONAL_LINK: "Personal_link",
  COUPON_CODE: "Coupon_code",
  SOCIAL_MEDIA_IMAGE: "Social_media_image",
  EMAIL: "Email"
}

const useStyles = makeStyles({
  root: {
    minWidth: '30px'
  },
});

export const ReferalProgramForm = ({ onHide, referralProgram, edit, user }) => {
  const classes = useStyles();
  const [{ data, loading, error }, doPost] = useAxios({
    url: '/referralProgram/',
    method: 'POST'
  }, { manual: true })

  const [getUserReq, getUser] = useAxios({
    url: '/user/getPartners',
  }, { manual: true })

  useEffect(() => {
    if (user.role == "Super_admin") {
      getUser()
    }
  }, [])

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
              description: referralProgram.description,
              endDate: referralProgram.endDate || new Date(),
              isActive: referralProgram.isActive || false,
              SocialShares: referralProgram.SocialShares || [],
              noEndDate: !referralProgram.name ? false : referralProgram && !referralProgram.endDate ? true : false,

              giftCount: referralProgram?.Gifts?.length || 1,
              rewardType: referralProgram?.customerRewardType || REWARD_TYPE_ENUM.STORED_CREDIT,
              gifts: referralProgram?.Gifts?.length ? referralProgram.Gifts : [{ name: "", referralId: "" }],
              emailTemplate: referralProgram?.emailTemplate || "",
              emailFrom: referralProgram?.emailFrom || "",
              emailSubject: referralProgram?.emailSubject || "",
              setCreditExpiryDate: referralProgram?.creditExpiryDate ? true : false,
              creditExpiryDate: referralProgram?.creditExpiryDate || undefined,
              creditToAward: referralProgram?.creditToAward || null,
              setMaxCreditPerCustomer: referralProgram?.customerMaxStoreCredit ? true : false,
              maxCreditPerCustomer: referralProgram?.customerMaxStoreCredit || "",
              customerFreeProduct: referralProgram?.customerFreeProduct || null,

              destinationLink: referralProgram?.destinationLink || "",

              linkTo: referralProgram?.UserId || undefined,

              rewardFriendType: referralProgram?.friendRewardType || REWARD_TYPE_ENUM.DISCOUNT,
              discountAmount: referralProgram?.friendDiscountAmount || "",
              discountUnit: referralProgram?.friendDiscountUnit || "",

              freeDeliver: referralProgram?.freeDeliver || false,

              friendFreeProduct: referralProgram?.friendFreeProduct || null,

              personalLinkPromotion: referralProgram.promotionMethods ? referralProgram.promotionMethods.includes(PROMOTION_ENUM.PERSONAL_LINK) : false,
              couponPromotion: referralProgram.promotionMethods ? referralProgram.promotionMethods.includes(PROMOTION_ENUM.COUPON_CODE) : false,
              socialMediaImage: referralProgram.promotionMethods ? referralProgram.promotionMethods.includes(PROMOTION_ENUM.SOCIAL_MEDIA_IMAGE) : false,
              emailPromotion: referralProgram.promotionMethods ? referralProgram.promotionMethods.includes(PROMOTION_ENUM.EMAIL) : false,

              shareImage: null,
              previewImage: referralProgram.imgUrl
            }}
            validate={values => {
              const errors = {};

              if (!values.name) errors.name = "Field required"
              if (!values.description) errors.description = "Field required"
              if (values.noEndDate == false) {
                if (!values.endDate) errors.endDate = "Field required"
              }

              if (values.rewardType == REWARD_TYPE_ENUM.STORED_CREDIT) {
                if (!values.creditToAward) {
                  errors.creditToAward = "Field required"
                } else if (isNaN(values.creditToAward)) {
                  errors.creditToAward = "Field must be a number"
                }
              }

              if (values.setMaxCreditPerCustomer) {
                if (!values.maxCreditPerCustomer) {
                  errors.maxCreditPerCustomer = "Field required"
                } else if (isNaN(values.creditToAward)) {
                  errors.creditToAward = "Field must be a number"
                }
              }

              if (values.rewardType == REWARD_TYPE_ENUM.FREE_PRODUCT) {
                if (!values.customerFreeProduct) errors.customerFreeProduct = "Field required"
              }

              if (values.rewardFriendType == REWARD_TYPE_ENUM.DISCOUNT) {
                if (!values.discountAmount) errors.discountAmount = "Field required"
                if (!values.discountUnit) errors.discountUnit = "Select one option"
              }

              if (values.rewardFriendType == REWARD_TYPE_ENUM.FREE_PRODUCT) {
                if (!values.friendFreeProduct) errors.friendFreeProduct = "Field required"
              }

              if (!values.personalLinkPromotion && !values.couponPromotion && !values.socialMediaImage && !values.emailPromotion) {
                errors.promotionMethod = "Select at least one option"
              }

              if (values.socialMediaImage) {
                if (!values.shareImage && !referralProgram.imgUrl) errors.shareImage = "Field required"
              }

              if (values.emailPromotion) {
                if (!values.emailTemplate) errors.emailTemplate = "Field required"
              }


              return errors;
            }}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              delete values.previewImage
              const data = new FormData()

              Object.keys(values).forEach((k) => {
                if (values[k]) data.append(k, values[k])
              })

              doPost({ data, headers: { 'Content-Type': 'multipart/form-data' } })
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

                  <div className="form-group" style={{ marginBottom: 0 }}>
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

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <TextField
                      label="Description"
                      margin="normal"
                      className="kt-width-full"
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      helperText={touched.description && errors.description}
                      error={Boolean(touched.description && errors.description)}
                    />
                  </div>

                  {values.noEndDate == false && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
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

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <FormControlLabel
                      control={<Checkbox checked={values.noEndDate} onChange={() => {
                        setFieldValue("noEndDate", !values.noEndDate)
                        setFieldValue("endDate", null)
                      }} name="checkedA" />}
                      label="No End Date"
                    />
                  </div>

                  <div className="form-group">
                    <FormControlLabel
                      control={<Checkbox checked={values.isActive} onChange={() => {
                        setFieldValue("isActive", !values.isActive)
                      }} name="checkedA" />}
                      label="Is Active"
                    />
                  </div>
                  <Typography variant="h6" gutterBottom>
                    Create a Reward for your customer
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.rewardType}
                    onChange={(e) => setFieldValue("rewardType", e.target.value)}
                  >
                    <MenuItem value={REWARD_TYPE_ENUM.STORED_CREDIT}>Stored Credit</MenuItem>
                    <MenuItem value={REWARD_TYPE_ENUM.GIFT}>Gift</MenuItem>
                    <MenuItem value={REWARD_TYPE_ENUM.FREE_PRODUCT}>Free Product</MenuItem>
                  </Select>
                  {values.rewardType == REWARD_TYPE_ENUM.STORED_CREDIT && (
                    <>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <TextField
                          placeholder="How much store credit you want to give per referral (in euros, no symbol)"
                          margin="normal"
                          className="kt-width-full"
                          name="creditToAward"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.creditToAward}
                          helperText={touched.creditToAward && errors.creditToAward}
                          error={Boolean(touched.creditToAward && errors.creditToAward)}
                        />
                      </div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.setCreditExpiryDate}
                            onChange={() => setFieldValue("setCreditExpiryDate", !values.setCreditExpiryDate)}
                            color="primary"
                          />
                        }
                        label="Set a store credit expiry date"
                      />
                      {values.setCreditExpiryDate == true && (
                        <div className="form-group">
                          <DatePicker
                            fullWidth
                            placeholder="Credit Expiry Date"
                            helperText={touched.creditExpiryDate && errors.creditExpiryDate}
                            error={Boolean(touched.creditExpiryDate && errors.creditExpiryDate)}
                            autoOk
                            disableToolbar
                            variant="inline"
                            value={values.creditExpiryDate}
                            onChange={(d) => setFieldValue("creditExpiryDate", d)}
                          />
                        </div>
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.setMaxCreditPerCustomer}
                            onChange={() => setFieldValue("setMaxCreditPerCustomer", !values.setMaxCreditPerCustomer)}
                            color="primary"
                          />
                        }
                        label="Set a maximum store credit your customer can have"
                      />
                      {values.setMaxCreditPerCustomer == true && (
                        <div className="form-group col-md-6" style={{ marginBottom: 0 }}>
                          <TextField
                            label={`Enter a discount value`}
                            margin="normal"
                            className="kt-width-full"
                            name={`maxCreditPerCustomer`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.maxCreditPerCustomer}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {values.rewardType == REWARD_TYPE_ENUM.FREE_PRODUCT && (
                    <>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values.customerFreeProduct}
                        onChange={(e) => setFieldValue("customerFreeProduct", e.target.value)}
                        error={Boolean(touched.customerFreeProduct && errors.customerFreeProduct)}
                      >
                        <MenuItem value={1}>Product A</MenuItem>
                        <MenuItem value={2}>Product B</MenuItem>
                        <MenuItem value={3}>Product C</MenuItem>
                        <MenuItem value={4}>Product E</MenuItem>
                      </Select>
                      {touched.customerFreeProduct && errors.customerFreeProduct && (
                        <FormHelperText error={true}>
                          {errors.customerFreeProduct}
                        </FormHelperText>
                      )}
                    </>
                  )}
                  {values.rewardType == REWARD_TYPE_ENUM.GIFT && (
                    <div className="form-group">
                      <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values.giftCount}
                        onChange={(e) => {
                          setFieldValue("giftCount", e.target.value)
                          const gifts = Array(e.target.value).fill("a").map(() => {
                            return { name: "", referralId: "" }
                          })

                          setFieldValue("gifts", gifts)
                        }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                      <FieldArray
                        name="gifts"
                        render={arrayHelpers => (
                          <div>
                            {values.gifts.map((gift, index) => (
                              <div style={{ flexDirection: 'row', display: 'flex' }}>
                                <div className="form-group col-md-6" style={{ marginBottom: 0 }}>
                                  <TextField
                                    label={`Define Gift ${index + 1}`}
                                    margin="normal"
                                    className="kt-width-full"
                                    name={`gifts[${index}].name`}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                      arrayHelpers.replace(index, { ...gift, name: e.target.value })
                                    }}
                                    value={gift.name}
                                  />
                                </div>
                                <div className="form-group col-md-6" style={{ marginBottom: 0 }}>
                                  <TextField
                                    label={`Number of referral to get Gift ${index + 1}`}
                                    margin="normal"
                                    className="kt-width-full"
                                    name={`gifts[${index}].referralId`}
                                    onBlur={handleBlur}
                                    onChange={(e) => arrayHelpers.replace(index, { ...gift, referralId: e.target.value })}
                                    value={gift.referralId}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  )}
                  <Typography variant="h6" gutterBottom style={{ marginTop: '4%' }}>
                    Create a Reward for their friend
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.rewardFriendType}
                    onChange={(e) => setFieldValue("rewardFriendType", e.target.value)}
                  >
                    <MenuItem value={REWARD_TYPE_ENUM.DISCOUNT}>{REWARD_TYPE_ENUM.DISCOUNT}</MenuItem>
                    <MenuItem value={REWARD_TYPE_ENUM.FREE_PRODUCT}>Free Product</MenuItem>
                  </Select>

                  {values.rewardFriendType == REWARD_TYPE_ENUM.DISCOUNT && (
                    <>
                      <div style={{ marginBottom: 0 }}>
                        <TextField
                          label={`Store Credit Maximum`}
                          margin="normal"
                          className="kt-width-full"
                          name={`discountAmount`}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.discountAmount}
                          helperText={touched.discountAmount && errors.discountAmount}
                          error={Boolean(touched.discountAmount && errors.discountAmount)}
                        />
                      </div>
                      <RadioGroup aria-label="gender" name="discountUnit" value={values.discountUnit} onChange={handleChange}>
                        <FormControlLabel checked={values.discountUnit == "%"} value="%" control={<Radio />} label="%" />
                        <FormControlLabel checked={values.discountUnit == "€"} value="€" control={<Radio />} label="€" />
                      </RadioGroup>
                      {touched.discountUnit && errors.discountUnit && (
                        <FormHelperText error={true}>
                          {errors.discountUnit}
                        </FormHelperText>
                      )}
                    </>
                  )}
                  {values.rewardFriendType == REWARD_TYPE_ENUM.FREE_PRODUCT && (
                    <>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={parseInt(values.friendFreeProduct)}
                        onChange={(e) => setFieldValue("friendFreeProduct", e.target.value)}
                      >
                        <MenuItem value={1}>Product A</MenuItem>
                        <MenuItem value={2}>Product B</MenuItem>
                        <MenuItem value={3}>Product C</MenuItem>
                        <MenuItem value={4}>Product E</MenuItem>
                      </Select>
                    </>
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.freeDeliver}
                        onChange={() => setFieldValue("freeDeliver", !values.freeDeliver)}
                        color="primary"
                      />
                    }
                    label="Include Free Deliver"
                  />

                  <Typography variant="h6" gutterBottom style={{ marginTop: '4%' }}>
                    Choose Promotion method
                  </Typography>

                  {errors.promotionMethod && (
                    <FormHelperText error={true}>
                      {errors.promotionMethod}
                    </FormHelperText>
                  )}

                  <div style={{ display: 'flex', flexDirection: "column" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.personalLinkPromotion}
                          onChange={() => setFieldValue("personalLinkPromotion", !values.personalLinkPromotion)}
                          color="primary"
                        />
                      }
                      label="Personal Link"
                    />

                    {values.personalLinkPromotion == true && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <TextField
                          label="Destination Link"
                          margin="normal"
                          className="kt-width-full"
                          name="destinationLink"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destinationLink}
                          helperText={touched.destinationLink && errors.destinationLink}
                          error={Boolean(touched.destinationLink && errors.destinationLink)}
                        />
                      </div>
                    )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.couponPromotion}
                          onChange={() => setFieldValue("couponPromotion", !values.couponPromotion)}
                          color="primary"
                        />
                      }
                      label="Coupon Code"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.socialMediaImage}
                          onChange={() => setFieldValue("socialMediaImage", !values.socialMediaImage)}
                          color="primary"
                        />
                      }
                      label="Image to share for social media"
                    />

                    {values.socialMediaImage == true && (
                      <>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            type="file"
                            onChange={(e) => {
                              setFieldValue("shareImage", e.target.files[0])

                              var oFReader = new FileReader();
                              oFReader.readAsDataURL(e.target.files[0]);

                              oFReader.onload = function (oFREvent) {
                                setFieldValue("previewImage", oFREvent.target.result)
                              };
                            }}
                          />
                          <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                              Upload
                          </Button>
                          </label>
                        </div>
                        {errors.shareImage && (
                          <FormHelperText error={true}>
                            {errors.shareImage}
                          </FormHelperText>
                        )}
                        {values.previewImage && (
                          <img src={values.previewImage} style={{ height: '100px', width: '100px' }} />
                        )}
                      </>
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.emailPromotion}
                          onChange={() => setFieldValue("emailPromotion", !values.emailPromotion)}
                          color="primary"
                        />
                      }
                      label="Email"
                    />

                    {values.emailPromotion == true && (
                      <>
                        <div className="form-group" style={{ marginBottom: 0 }}>
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
                          <Typography>Short codes</Typography>
                          <div>
                            <b>##Name##</b>
                            Friend's Name
                          </div>
                          <div>
                            <b>##Email##</b>
                            Friend's Email
                          </div>
                          <div>
                            <b>##WebsiteUrl##</b>
                            Website url
                          </div>
                          <div>
                            <b>##ReferralCode##</b>
                            Referral Code
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <TextField
                            label="From Email"
                            margin="normal"
                            className="kt-width-full"
                            name="emailFrom"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.emailFrom}
                            helperText={touched.emailFrom && errors.emailFrom}
                            error={Boolean(touched.emailFrom && errors.emailFrom)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <TextField
                            label="Subject"
                            margin="normal"
                            className="kt-width-full"
                            name="emailSubject"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.emailSubject}
                            helperText={touched.emailSubject && errors.emailSubject}
                            error={Boolean(touched.emailSubject && errors.emailSubject)}
                          />
                        </div>
                      </>
                    )}

                    {user.role == "Super_admin" && (
                      <>
                        <Typography variant="h6" gutterBottom display="block">
                          Link to user
                        </Typography>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values.linkTo}
                          onChange={(e) => setFieldValue("linkTo", e.target.value)}
                        >
                          {getUserReq?.data?.map(u => {
                            return <MenuItem value={u.id}>{u.companyName}</MenuItem>
                          })}
                        </Select>
                      </>
                    )}
                  </div>

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

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(ReferalProgramForm);
