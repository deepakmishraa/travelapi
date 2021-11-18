const express = require("express");
const router = express.Router();
const Text_Template = require('../../models/Text_template');
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const Sequelize = require('sequelize');
const op = Sequelize.Op;

router.use(bodyParser.json());

router.post('/getMessage', async (req, res) => {
  try {
    const { user_id } = req.body;
    const message = await Text_Template.findAll({ where: { user_id } });
    res.json({ message });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

router.post('/getAllMessage', async (req, res) => {
  try {
    const { user_id, business_id } = req.body;
    const message = await Text_Template.findAll({
      where: {
        [op.and]: [
          { business_id },
          {
            [op.or]: [
              { user_id },
              { user_id: 1 }
            ]
          }
        ]
      }
    })

    res.json({ message });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

router.post('/addMessage', [
  check('text_data',"Please enter the message field").not().isEmpty(),
  check('business_id',"Please select the Business Category").not().isEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { user_id, business_id, text_data } = req.body;

    Text_Template.create({
      text_data,
      user_id,
      business_id
    });

    res.json({ msg: "Data Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
})

router.delete("/deleteMessage/:id", (req, res) => {
  try {
    let text_id = req.params.id;
    Text_Template.destroy({ where: { text_id } })
    res.json({ msg: "Data deleted successfully!" })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;