/**
 * @file equipment.js
 * @description Dieses Modul enthält die Routen für die Verwaltung des Equipments.
 * Es kommuniziert mit dem Equipment-Controller und stellt sicher, dass nur berechtigte Benutzer
 * Zugriff auf bestimmte Funktionen haben.
 */

var express = require('express');
var router = express.Router();
let equipmentController = require('../controllers/equipmentController');
let utils = require('../controllers/controllerUtils');

// Route für alle Equipment-Operationen
router.route('/')

  // Alle Equipments anzeigen
  .get(async (req, res, next) => {
    console.log(req.query);
    let response = await equipmentController.getEquipment(req);
    res.render('Equipment/allEquip', { "data": response.data, "auth": response.auth, "user": req.session.user });
  })

  // Neues Equipment erstellen
  .post(async (req, res, next) => {
    let response = await equipmentController.createEquipment(req, res);
    if (response.status == 403) {
      console.log("==Frontend== Not authorized");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('/equipment');
    }
    else if (response.status == 400) {
      console.log("==Frontend== Bad request");
      req.flash('error', response.data);
      res.redirect('/equipment');
    }
    else {
      req.flash('success', 'Equipment erfolgreich erstellt');
      res.redirect('/equipment/');
    }
  });

// Route zum Löschen eines Equipments
router.route('/delete/:id')
  // Zeigt das Equipment an, wenn GET aufgerufen wird
  .get(async (req, res, next) => {
    res.redirect('/equipment/' + req.params.id);
  })

  // Equipment löschen
  .post(async (req, res, next) => {
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

// Route zum Bearbeiten eines Equipments
router.route('/edit/:id')
  // Zeigt die Bearbeitungsseite für ein Equipment an
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

  // Equipment bearbeiten
  .post((req, res, next) => {
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

// Route zum Anzeigen eines einzelnen Equipments
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
