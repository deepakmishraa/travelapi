const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const Business = sequelize.define("business_category",
    {
        business_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        business_name:{
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true 
    }
)

module.exports = Business;