var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');

//equipment routes
router.route('/')
.get(async (req, res, next) => {
      let response = await equipmentController.getEquipment();
      res.render('equipment', { "data": response.data, title: 'Ausleihen' });
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
      res.render('singleEquipSite', { "data": response.data, title: response.data.title });
}) //delete function is in beta
.delete(async(req, res, next) => {
  console.log("deleted");
  equipmentController.deleteEquipment(req.params.id)
    .then(response => {
     console.log('checkpoint');
     res.render('equipment', { "data": response.data, title: 'Ausleihen' });
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