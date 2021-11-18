const Sequelize = require("sequelize");
const sequelize = require('../config/db')
const Customer = sequelize.define("customer", 
  {
    user_id: {
      type: Sequelize.INTEGER,
    }, 
    customer_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    message:{
      type:Sequelize.STRING
    },
    image_name:{
      type:Sequelize.STRING
    },
    anniversary:{
      type: Sequelize.DATEONLY
    },
  },{
    timestamps: false,
    freezeTableName: true 
  }
)

module.exports = Customer;