const Sequelize = require("sequelize");
const sequelize = require('../config/db')
const User = sequelize.define("user", 
  {
    user_id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username:{
      type: Sequelize.STRING
    },
    email:{
      type:Sequelize.STRING,
      primaryKey: true
    },
    password:{
      type: Sequelize.STRING
    },
    role:{
      type:Sequelize.STRING
    },
    business_id:{
      type: Sequelize.INTEGER
    },
    businessName: {
      type: Sequelize.STRING
    },
    contactNo:{
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps:false,
    freezeTableName: true
  }
);

module.exports = User;