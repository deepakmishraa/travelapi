const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const Template = sequelize.define("template",
 {
   business_id:{
    type:Sequelize.INTEGER
   },
   template_id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     primaryKey: true
   },
   template_name:{
     type: Sequelize.STRING
   },
   image_name:{
     type: Sequelize.STRING
   }
 }, 
 {
   timestamps: false,
   freezeTableName: true
 }
);

module.exports = Template;