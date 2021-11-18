const Sequelize = require('sequelize');
const sequelize = require('../config/db')
const Text_Template = sequelize.define("text_template", 
  {
    text_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id:{
      type: Sequelize.INTEGER
    },
    business_id:{
      type:Sequelize.INTEGER
    },
    text_data:{
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)

module.exports = Text_Template;