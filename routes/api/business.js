const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Business = require('../../models/Business');
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
  try {
    const business = await Business.findAll();
    res.json({ business });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.post("/addCategory", [
  check('category', 'Please add a valid category').exists().isLength({ min: 3 })
], async (req, res) => {
  if(req.role == 'admin') {
    return res.status(401).json({msg:'Not token, authorization denied'});
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { category } = req.body;

    Business.create({
      business_name: category
    });

    res.json({ msg: "Data Added Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;