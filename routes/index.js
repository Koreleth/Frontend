/**
 * @file index.js
 * @description Dieses Modul enthält die Routen für die Startseite und die Registrierung. Es kommuniziert mit dem Index-Controller und dem Benutzer-Controller.
 */

var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');
let usersController = require('../controllers/userController');

/**
 * Route für die Startseite
 */
router.route('/')
  .get(async (req, res, next) => {
    // Ruft die Daten für die Startseite vom Index-Controller ab
    let response = await indexController.getIndex(req);
    console.log(response.data);
    console.log("CART SIZE:" + res.locals.cartSize);
    // Rendert die Startseite mit den beliebtesten Artikeln und dem Seitentitel
    res.render('index', { "popularItems": response.data.items, title: response.title });
  });

/**
 * Route für die Registrierung
 */
router.route('/register')
  // Zeigt das Registrierungsformular an
  .get((req, res, next) => {
    res.render('User/register');
  })
  // Verarbeitet die Registrierungsdaten
  .post(async (req, res, next) => {
    // Ruft die Registrierungsmethode des Benutzer-Controllers auf
    let response = await usersController.register(req);
    if (response.status == 400) {
      // Bei Fehler wird eine Fehlermeldung angezeigt und zur Startseite weitergeleitet
      req.flash('error', response.data);
      res.redirect('/');
    }
    if (response.status == 200) {
      // Bei Erfolg wird eine Erfolgsmeldung angezeigt und zur Startseite weitergeleitet
      req.flash('success', 'Registrierung erfolgreich');
      res.redirect('/');
    }
  });

module.exports = router;
