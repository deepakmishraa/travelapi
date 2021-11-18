const Sequelize = require('sequelize');
const sequelize =  new Sequelize("u446054181_Demo", "u446054181_demouser", 'Deepak@125', {
  host:"sql123.main-hosting.eu",
  dialect:"mysql",
  password:"Deepak@125"
});


// const sequelize =  new Sequelize("xksizapa_demo", "xksizapa_demo", 'Deepak@125', {
//   host:"103.108.220.91",
//   dialect:"mysql",
//   password:"Deepak@125"
// });

sequelize.authenticate()
.then(()=>{
  console.log('Connection has been established')
})
.catch(err => {
  console.error('Unable to connect', err);
})

module.exports = sequelize;