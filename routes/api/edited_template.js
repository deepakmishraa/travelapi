const express = require('express');
const router = express.Router();
const Edited_Template = require('../../models/EditedTemplate');
const fs = require('fs')
const bodyParser = require('body-parser');
const { check, validationResult } = require("express-validator");

router.use(bodyParser.json());
router.use(bodyParser.json({limit: "10mb"}));

router.post('/getEditedtemplate', async (req, res) => {
  try {
    const { user_id } = req.body;
    const template = await Edited_Template.findAll({where: {
      user_id
    }});
    for(let i=0; i<template.length; i++) {
      const file = await fs.readFileSync(`./images/edited_templates/${template[i].template_name}`
      );
      template[i].template_name = file.toString("base64");
    }
    res.json({template})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
})

router.post('/add_edited_template', async (req, res) => {
  try {
    const {url, user_id} = req.body;
    let date = new Date();
    let template_name = `${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.png`;
    const base64data = url.replace(/^data:.*,/,'');
    fs.writeFile(`./images/edited_templates/${template_name}`, base64data, 'base64', (err)=> {
      if(err) {
        console.log(err);
      }
    })

    Edited_Template.create({
      user_id,
      template_name
    })

    res.json({msg:"Your edit saved successfully!"})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;