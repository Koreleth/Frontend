var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');
let equipmentController = require('../controllers/equipmentController');

/* GET home page. */

router.route('/')
.get ((req,res,next) => {
  let response = indexController.getIndex();
  console.log (response);
  res.render('index', { "data": response.data});
});


//equipment routes
router.route('/equipment')
.get(async (req, res, next) => {
  try {
      let response = await equipmentController.getEquipment();
      res.render('equipment', { "data": response.data });
  } catch (error) {
      next(error);
  }
})
.post (async (req,res,next) => {
 try {
  let response = await equipmentController.createEquipment(req.body);
  console.log(response);
  res.redirect('/equipment/' + response.data.id);
 } catch (error) {
   next(error);
 }
});

router.route('/equipment/:id')
.get(async (req, res, next) => {
  try {
      let response = await equipmentController.getSingleEquipment(req.params.id);
      res.render('singleEquipSite', { "data": response.data });
  } catch (error) {
      next(error);
  }
})

module.exports = router;

