const jwt = require('jsonwebtoken');
const db = require('../config/db');
const user = require('../models/User')

module.exports = (req, res, next) => {

  const token = req.headers['authorization'];
  
  if(!token) {
    return res.status(401).json({msg:'Not token, authorization denied'});
  }

  try {
    const decoded = jwt.verify(token, 'mytoken');
    req.role = decoded.role;
    if(decoded.exp-decoded.iat > 3600 ) {
      res.status(401).json({msg:'Token is  valid'});
    }
    next();
  } catch (error) {
    res.status(401).json({msg:'Token is not valid'});
  }
}