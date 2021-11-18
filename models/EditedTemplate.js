const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Edited_Template = sequelize.define("editedtemplate",
 {
  user_id: {
    type: Sequelize.INTEGER
  },
  template_id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  template_name: {
    type: Sequelize.STRING
  }
 },
 {
   timestamps: false,
   freezeTableName: true
 }
)

module.exports = Edited_Template;