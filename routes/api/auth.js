const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const Business = require('../../models/Business')

router.post('/login', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required').exists().isLength({min:6})
], async (req, res)=> {
  console.log(req.body)
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()})
  }
  try{
    const {email, password} = req.body;

    let user = await User.findOne({where:{email}});

    if(!user) {
      return res.status(400).json({errors:[{msg:"Invalid Credentials!"}]})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }
    
    const {username, role, user_id, business_id} = user;

    let business_name=null;
    
    if(role == 'admin') {
      business_name = null;
    } else {
      const business = await Business.findOne({where: {business_id}});
      business_name = business.business_name;
    }

    let payload = {
      user: {
        username,
        email,
        role,
        business_id,
        business_name
      }
    }

    jwt.sign({email, username, role, user_id, business_id, business_name}, 'mytoken', {expiresIn: "1h"}, (err, token)=> {
      if(err) throw err;
      res.json({token, msg:"Logged in Successfully!"});
    })

  } catch(error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
})

router.post('/register', [
  check('username', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({min:6}),
  check('business_id', 'Please select a category').not().isEmpty()
  ], async (req, res)=> {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }
    
    try {
      const {username, email, password, business_id} = req.body;
      const user = await User.findOne({ where:{ email } })

      if(user) {
        return res.status(400).json({errors:[{msg: 'User already exists'}]});
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const role = 'user';

      User.create({
        username,
        email,
        password:hash,
        role,
        business_id
      });

      const business = await Business.findOne({where: {business_id}})

      let payload = {
        user: {
          username,
          email,
          role,
          business_id,
          business_name: business.business_name
        }
      }

      jwt.sign(payload, 'mytoken', {expiresIn: "1h"}, (err, token) => {
        if(err) throw err;
        res.json({token, msg:"User Registered Successfully"})
      })

    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
})

module.exports = router;