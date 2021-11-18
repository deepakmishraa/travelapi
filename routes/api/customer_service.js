const express = require("express");
const router = express.Router();
const Service = require('../../models/Service');
const User = require('../../models/User');
const { check, validationResult } = require("express-validator")

router.post('/addService', [
  check('service_data', "Please enter the service field").not().isEmpty(),
  check('business_id', "Please select the Business Category").not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { user_id, business_id, service_data } = req.body;
    console.log(req.body)

    Service.create({
      user_id,
      business_id,
      service_data
    })

    res.json({ msg: "Data added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.post('/getService', async (req, res) => {
  try {
    const { user_id } = req.body;

    let service = await Service.findAll({
      where: {
        user_id
      }
    })

    res.json({ service })
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.delete('/deleteService/:id', async (req, res) => {
  try {
    const service_id = req.params.id;

    Service.destroy({
      where: {
        service_id
      }
    })

    res.json({ msg: "Deleted Successfully!" })
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.get('/getBusinessDetails/:id', async (req, res) => {
  try {
    const user_id = req.params.id;
    const details = await User.findOne({ where: { user_id } });
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

// @route  PUT api/service/businessDetails
// @desc   Update businessDetails
// access  private
router.put('/businessDetails', [
  check('businessName', 'Please enter a Business Name ').not().isEmpty(),
  check('businessName', 'Please enter a Business Name of length less than 26').isLength({ max: 26 }),
  check('contactNo', 'Please enter a valid Contact Number').isLength({ min: 10 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { user_id, businessName, contactNo } = req.body;
    await User.update({
      businessName,
      contactNo
    }, {
      where: {
        user_id
      }
    })
    res.json({ msg: "Business Details updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})
module.exports = router;