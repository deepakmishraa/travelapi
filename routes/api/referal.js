const express = require('express');
const router = express.Router();
const Referal = require('../../models/Referal');

// @route   Get api/referal
// @desc    Get referal codes
// @access  Private
router.get('/', async (req, res) => {
  console.log("In get")
  try {
    let referal = await Referal.findAll();
    res.json(referal);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server Error!');
  }
})

// // @route   POST api/referal/generateReferal
// // @desc    Generate referal code
// // @access  Private
router.post('/generateReferal', async (req, res)=> {
  try {
    let code = Math.floor(10000 + Math.random() * 90000);
    Referal.create({
      code,
      assigned_to: -1,
      assigned_status: false
    })
    const referals = await Referal.findAll();
    res.json(referals)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
})

// @route   DELETE api/referals
// @desc    Delete Referal Code
// @access  Private
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Referal.destroy({where: {id}})
    const referal = await Referal.findAll();
    res.json(referal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error!');
  }
})

// @route   POST api/assignReferal
// @desc    Assign referal to user
// @access  Private
router.post('/assignUser', async (req, res) => {
  const {id, code} =  req.body;
  try {
    const referal = await Referal.findOne({where: {code}});
    if(!referal || referal.assigned_to != -1) {
      return res.json({error: 'Referal Code is not valid'});
    }

    referal.update({
      assigned_to: id,
      assigned_status: true
    }, {where:{code}})

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error!')
  }
})

// @route   GET api/checkUser/:id
// @desc    Check user with referl exists
// @access  Private

router.get('/checkUser/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const referal = await Referal.findOne({where: {assigned_to: id}});
    if(!referal) {
      return res.json(null);
    }
    res.status(200).json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
})

module.exports = router;