const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const Customer_Data = sequelize.define("customer_data", 
  {
    customer_data_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id:{
      type: Sequelize.INTEGER
    },
    last_visit: {
      type: Sequelize.DATE
    },
    payment: {
      type: Sequelize.INTEGER
    },
    service:{
      type:Sequelize.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true
  }
)

module.exports = Customer_Data;