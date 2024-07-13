var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');

//equipment routes
router.route('/')
.get(async (req, res, next) => {
      let response = await equipmentController.getEquipment();
      console.log(response);
      res.render('equipment', { "data": response.data });
})
.post((req, res, next) => {
  equipmentController.createEquipment(req)
    .then(response => {
      res.redirect('/equipment/' + response.data.id);
    })
    .catch(error => {
      next(error);
    });
});

router.route('/:id')
.get(async (req, res, next) => {
      let response = await equipmentController.getSingleEquipment(req.params.id);
      console.log(response);
      res.render('singleEquipSite', { "data": response.data });
})



module.exports = router;