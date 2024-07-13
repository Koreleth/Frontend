var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');

//equipment routes
router.route('/')
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
  res.redirect('/' + response.data.id);
 } catch (error) {
   next(error);
 }
});

router.route('/:id')
.get(async (req, res, next) => {
  try {
      let response = await equipmentController.getSingleEquipment(req.params.id);
      res.render('singleEquipSite', { "data": response.data });
  } catch (error) {
      next(error);
  }
})

module.exports = router;