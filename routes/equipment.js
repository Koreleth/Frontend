var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');

//equipment routes
router.route('/')

  //Alle Equipments anzeigen
  .get(async (req, res, next) => {
    let response = await equipmentController.getEquipment();
    res.render('Equipment/allEquip', { "data": response.data });
  })
  //Neues Equipment erstellen
  .post((req, res, next) => {
    equipmentController.createEquipment(req, res)
      .then(response => {
        res.redirect('/equipment/' + response.data.id);
      })
      .catch(error => {
        next(error);
      });
  });



router.route('/delete/:id')
  //Wenn get aufgerufen wird equipment angezeigt
  .get(async (req, res, next) => {
    res.redirect('/equipment/' + req.params.id);
  })
  //Equipment löschen
  .post(async (req, res, nex) => {
    equipmentController.deleteEquipment(req.params.id)
      .then(response => {
        res.redirect('/equipment');
      })
      .catch(error => {
        next(error);
      });
  });

router.route('/edit/:id')
  //Wenn get aufgerufen wird equipment Bearbeitungs Seite angezeigt
  .get(async (req, res, next) => {
    let response = await equipmentController.getSingleEquipment(req.params.id);
    if (response.status != 200) {
      console.log("==Frontend== Equipment does not exist");
      res.redirect('/equipment');
    }
    else {
      res.render('Equipment/editEquip', { "data": response.data });
    }
  })

  //Equipment bearbeiten
  .post((req, res, next) => {
    console.log("edit");
    console.log(req.body);
    equipmentController.updateEquipment(req, res)
      .then(response => {
        res.redirect('/equipment/' + req.params.id);
      })
      .catch(error => {
        next(error);
      });
  });


router.route('/:id')
  .get(async (req, res, next) => {
    let response = await equipmentController.getSingleEquipment(req.params.id);
    if (response.status != 200) {
      console.log("==Frontend== Equipment does not exist");
      res.redirect('/equipment/');
    }
    else {
      res.render('Equipment/singleEquip', { "data": response.data });
    }
  });



module.exports = router;