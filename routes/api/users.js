const express = require("express");
const router = express.Router();
const Customer = require("../../models/Customer");
const Customer_Data = require('../../models/Customer_data');
const fs = require("fs");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const auth = require('../../middleware/auth')

router.use(bodyParser.json());
router.use(bodyParser.json({ limit: "10mb" }));

router.post("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;

    let customer = await Customer.findAll({ where: { user_id } });

    for (let i = 0; i < customer.length; i++) {
      
      let customer_id = customer[i].customer_id;

      let maxCustomerDataId = await Customer_Data.findOne({
        attributes: [
          Sequelize.fn('max', Sequelize.col('customer_data_id')),
        ],raw: true,
        where: {
          customer_id
        }
      })

      const customerData = await Customer_Data.findOne({where:{
        customer_data_id: maxCustomerDataId['max(`customer_data_id`)']
      }})

      customer[i].dataValues.last_visit = customerData.last_visit;
      customer[i].dataValues.service = customerData.service;
      customer[i].dataValues.payment = customerData.payment;
      customer[i].dataValues.customer_data_id = customerData.customer_data_id;

      const image = await fs.readFileSync(`./images/customers/${customer[i].image_name}`);
      customer[i].image_name = image.toString('base64');

    }

    res.json({ customer });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/add/customer",
  [
    check("data.first_name", "First Name is required").not().isEmpty(),
    check("data.last_name", "Last Name is required").not().isEmpty(),
    check(
      "data.last_visit",
      "If a new customer then please select current Date"
    )
      .not()
      .isEmpty(),
    check(
      "data.anniversary",
      "Select the first day of customers visit"
    )
      .not()
      .isEmpty(),
    check(
      "data.service",
      "Make a Guess for 'What customer mostly prefer?'"
    )
      .not()
      .isEmpty(),
    check("data.payment", "Payment status of client").not().isEmpty(),
    check("data.message", "Describe about the customer").not().isEmpty(),
    check("image_name", "Ask the customer for their picture?").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        first_name,
        last_name,
        last_visit,
        anniversary,
        service,
        payment,
        message,
      } = req.body.data;

      const { user_id, image_url, image_name } = req.body;

      let img_name = `${first_name}_${last_name}_` + Date.now() + image_name;
      const base64data = image_url.replace(/^data:.*,/, '');
      fs.writeFile(`./images/customers/${img_name}`, base64data, 'base64', (err) => {
        if (err) {
          console.log(err);
        }
      })

      await Customer.create({
        user_id,
        first_name,
        last_name,
        message,
        image_name: img_name,
        anniversary,
      });

      let customer_id = await Customer.findOne({
        attributes: [Sequelize.fn('max', Sequelize.col('customer_id'))],
        raw: true
      })

      await Customer_Data.create({
        customer_id: customer_id['max(`customer_id`)'],
        last_visit,
        payment,
        service
      });

      res.json({ msg: "Customer Added Successfully!" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post('/update/profile', [
  check('service','Please fill the service field').not().isEmpty(),
  check('last_visit','Please select the visit date').not().isEmpty(),
  check('payment','Please enter the payment details').not().isEmpty(),
], async (req, res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const {customer_id, service, payment, last_visit} = req.body;

    Customer_Data.create({
      customer_id,
      service,
      last_visit,
      payment
    });

    const customer = await Customer.findOne({where: {customer_id}});
    let maxCustomerDataId = await Customer_Data.findOne({
      attributes: [
        Sequelize.fn('max', Sequelize.col('customer_data_id')),
      ],raw: true,
      where: {
        customer_id
      }
    })

    const customerData = await Customer_Data.findOne({where:{
      customer_data_id: maxCustomerDataId['max(`customer_data_id`)']
    }})

    customer.dataValues.last_visit = customerData.last_visit;
    customer.dataValues.service = customerData.service;
    customer.dataValues.payment = customerData.payment;
    customer.dataValues.customer_data_id = customerData.customer_data_id;

    const image = await fs.readFileSync(`./images/customers/${customer.image_name}`);
    customer.image_name = image.toString('base64');

    res.json({msg:"Profile updated successfully!", customer});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

router.put('/edit/profile', [
  check('service','Please fill the service field').not().isEmpty(),
  check('last_visit','Please select the visit date').not().isEmpty(),
  check('payment','Please enter the payment details').not().isEmpty(),
], async (req, res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const {customer_data_id, customer_id, service, payment, last_visit} = req.body;
    console.log(customer_data_id, customer_id, service, payment, last_visit)

    Customer_Data.update(
      {
        service,
        last_visit,
        payment
      },
      {where: {customer_data_id}}
    );

    const customer = await Customer.findOne({where: {customer_id}});

    let maxCustomerDataId = await Customer_Data.findOne({
      attributes: [
        Sequelize.fn('max', Sequelize.col('customer_data_id')),
      ],raw: true,
      where: {
        customer_id
      }
    })

    const customerData = await Customer_Data.findOne({where:{
      customer_data_id: maxCustomerDataId['max(`customer_data_id`)']
    }})

    customer.dataValues.last_visit = customerData.last_visit;
    customer.dataValues.service = customerData.service;
    customer.dataValues.payment = customerData.payment;
    customer.dataValues.customer_data_id = customerData.customer_data_id;

    const image = await fs.readFileSync(`./images/customers/${customer.image_name}`);
    customer.image_name = image.toString('base64');

    res.json({msg:"Profile updated successfully!", customer});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

router.post('/getGraph/Data', async (req, res) => {
  try {
    const {customer_id} = req.body;

    const graphData = await Customer_Data.findAll({where: { customer_id}});
    let Date = [], Payment = [];
    
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",  "Sep", "Oct", "Nov", "Dec"]

    for(let i=0; i<graphData.length-1; i++) {
      for(let j=i+1; j<graphData.length-1; j++)
      if(graphData[i].last_visit.split('-')[1] > graphData[j].last_visit.split('-')[1])
       {
         let temp = graphData[i];
         graphData[i] = graphData[j]
         graphData[j] = temp;
       }
    }

    for(let i=0; i<graphData.length; i++) {
      Date.push(months[graphData[i].last_visit.split('-')[1]-1]);
      Payment.push(graphData[i].payment)
    }

    res.json({Date, Payment, graphData})
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})


module.exports = router;
