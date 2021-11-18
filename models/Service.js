const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const Service = sequelize.define("customer_services",
    {
        user_id:{
            type: Sequelize.INTEGER
        },
        service_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        business_id:{
            type:Sequelize.INTEGER
        },
        service_data:{
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true 
    }
)

module.exports = Service;