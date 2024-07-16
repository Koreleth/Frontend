var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');

//equipment routes
router.route('/')
.get(async (req, res, next) => {
      let response = await equipmentController.getEquipment();
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
      res.render('singleEquipSite', { "data": response.data });
}) //delete function is in beta
.delete((req, res, next) => {
  equipmentController.deleteEquipment(req.params.id)
    .then(response => {
      res.redirect('/equipment');
    })
    .catch(error => {
      next(error);
    });
})
.put((req, res, next) => {
  equipmentController.updateEquipment(req)
    .then(response => {
      res.redirect('/equipment/' + response.data.id);
    })
    .catch(error => {
      next(error);
    });
});



module.exports = router;