var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');
let utils = require('../controllers/controllerUtils');

//equipment routes
router.route('/')

  //Alle Equipments anzeigen
  .get(async (req, res, next) => {
    let response = await equipmentController.getEquipment(req);
    res.render('Equipment/allEquip', { "data": response.data, "auth": response.auth });
  })
  //Neues Equipment erstellen
  .post(async (req, res, next) => {
    let response = await equipmentController.createEquipment(req, res)
    if (response.status == 403) {
      console.log("==Frontend== Not authorized");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('/equipment');
    }
    else {
      req.flash('success', 'Equipment erfolgreich erstellt');
      res.redirect('/equipment/');
    }
  });



router.route('/delete/:id')
  //Wenn get aufgerufen wird equipment angezeigt
  .get(async (req, res, next) => {
    res.redirect('/equipment/' + req.params.id);
  })
  //Equipment löschen
  .post(async (req, res, nex) => {
    console.log("DIREKT VOR DEM REQUEST" + req.session);
    let response = await equipmentController.deleteEquipment(req);
    if (response.status == 403) {
      console.log("==Frontend== Not authorized");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('/equipment');
    }
    else {
      console.log("==Frontend== Equipment deleted");
      req.flash('success', 'Equipment erfolgreich gelöscht');
      res.redirect('/equipment');
    }
  });

router.route('/edit/:id')
  //Wenn get aufgerufen wird equipment Bearbeitungs Seite angezeigt
  .get(async (req, res, next) => {
    if (!utils.auth(req)) {
      console.log("==Frontend== Not authorized");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('/equipment');
    }
    let response = await equipmentController.getSingleEquipment(req.params.id);
    if (response.status != 200) {
      req.flash('error', 'Equipment nicht gefunden');
      res.redirect('/equipment');
    }
    else {
      res.render('Equipment/editEquip', { "data": response.data });
    }
  })

  //Equipment bearbeiten
  .post((req, res, next) => {
    //console.log("edit");
    // console.log(req.body);
    equipmentController.updateEquipment(req, res)
      .then(response => {
        if (response.status == 403) {
          console.log("==Frontend== Not authorized");
          req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
          res.redirect('/equipment');
        }
        else {
          req.flash('success', 'Equipment erfolgreich bearbeitet');
          res.redirect('/equipment/' + req.params.id);
        }
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
      req.flash('error', 'Equipment nicht gefunden');
      res.redirect('/equipment/');
    }
    else {
      if (utils.auth(req)) {
        response.data.edit = true;
      }
      res.render('Equipment/singleEquip', { "data": response.data });
    }
  });



module.exports = router;