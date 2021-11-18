const Sequelize = require("sequelize");
const sequelize = require('../config/db');
const Referal = sequelize.define("referal",
  {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type:Sequelize.INTEGER,
    },
    assigned_to:{
      type: Sequelize.INTEGER
    },
    assigned_status:{
      type: Sequelize.BOOLEAN
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = Referal;