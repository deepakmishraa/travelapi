const express = require('express');
const cors = require('cors');

// const corsOptions = {
//   origin: "http://localhost:8100"
// };

const app = express();
app.use(cors());

app.use(express.json({extended: true, limit:'10mb'}))
app.use(express.urlencoded({extended: true, limit:'10mb'}))

const PORT = 8080;

app.get('/', (req, res)=>{
  res.send('Api Running');
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/template', require('./routes/api/template'));
app.use('/api/text_template', require('./routes/api/text_template'));
app.use('/api/edited_template', require('./routes/api/edited_template'));
app.use('/api/business', require('./routes/api/business'));
app.use('/api/service', require('./routes/api/customer_service'));
app.use('/api/referal', require('./routes/api/referal'));

app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));