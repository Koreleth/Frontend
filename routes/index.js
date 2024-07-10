var express = require('express');
var router = express.Router();
let indexController = require('../controller/indexController');
let equipmentController = require('../controller/equipmentController');

/* GET home page. */

router.route('/')
.get ((req,res,next) => {
  let response = indexController.getIndex();
  console.log (response);
  res.render('index', { "data": response.data});
});


//equipment routes
router.route('/equipment')
.get ((req,res,next) => {
  let response = equipmentController.getEquipment();
  res.render('equipment', { "data": response.data });
})
.post ((req,res,next) => {
  let response = equipmentController.createEquipment();
  res.render('equipment', { "data": response.data });
});

module.exports = router;
