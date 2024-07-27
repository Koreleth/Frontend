/**
 * @file users.js
 * @description Dieses Modul enthält die Routen für Benutzeraktionen wie Anzeigen, Bearbeiten und Löschen von Benutzern. Es kommuniziert mit dem Benutzer-Controller.
 */

var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
var utils = require('../controllers/controllerUtils');

/**
 * Route für die Benutzerliste
 */
router.get('/', async function (req, res, next) {
  // Überprüft, ob der Benutzer eingeloggt ist und Admin-Rechte hat
  if (!req.session.user) {
    req.flash('error', 'Du bist nicht eingeloggt.');
    res.redirect('/login');
  } else if (!utils.isAdmin(req)) {
    console.log("==Frontend== User not allowed to see all users");
    req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
    res.redirect('back');
  } else {
    // Holt alle Benutzer und rendert die Benutzerliste
    let users = await usersController.getAllUsers();
    res.render('User/users', { "users": users.data });
  }
});

router.route('/edit/:id')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req, res);
    // Überprüft den Status der Antwort und handelt entsprechend
    switch (response.status) {
      case 401:
        req.flash('error', 'Du bist nicht eingeloggt.');
        res.redirect('/login');
        break;
      case 404:
        req.flash('error', 'Nutzer nicht gefunden.');
        res.redirect('back');
        break;
      case 403:
        console.log("==Frontend== User not allowed to edit");
        req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
        res.redirect('back');
        break;
      default:
        res.render('User/editUser', { "user": response.data });
        break;
    }
  })
  .post(async (req, res, next) => {
    // Überprüft, ob der Benutzer Admin-Rechte hat
    if (!utils.isAdmin(req)) {
      console.log("==Frontend== User not allowed to edit");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('back');
    } else {
      // Aktualisiert die Benutzerdaten
      let response = await usersController.updateUser(req);
      console.log(response);
      if (response.status == 200) {
        req.flash('success', 'Nutzer erfolgreich bearbeitet.');
      } else {
        req.flash('error', 'Es ist ein Fehler aufgetreten.');
      }
      res.redirect('/users/' + req.params.id);
    }
  });

router.route('/delete/:id')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req, res);
    // Überprüft den Status der Antwort und handelt entsprechend
    switch (response.status) {
      case 404:
        req.flash('error', 'Nutzer nicht gefunden.');
        res.redirect('back');
        break;
      case 403:
        console.log("==Frontend== User not allowed to delete");
        req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
        res.redirect('back');
        break;
      case 401:
        req.flash('error', 'Du bist nicht eingeloggt.');
        res.redirect('/login');
        break;
      default:
        res.render('User/deleteUser', { "user": response.data });
        break;
    }
  })
  .post(async (req, res, next) => {
    // Überprüft, ob der Benutzer Admin-Rechte hat
    if (!utils.isAdmin(req)) {
      console.log("==Frontend== User not allowed to delete");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('back');
    } else {
      // Löscht den Benutzer
      let response = await usersController.deleteUser(req);
      console.log(response);
      if (response.status == 200) {
        req.flash('success', 'Nutzer erfolgreich gelöscht.');
      } else {
        req.flash('error', 'Es ist ein Fehler aufgetreten.');
      }
      res.redirect('/users');
    }
  });

router.get('/:id', async function (req, res, next) {
  let response = await usersController.getUser(req, res);
  console.log(response);
  // Überprüft den Status der Antwort und handelt entsprechend
  switch (response.status) {
    case 404:
      console.log("==Frontend== User not found");
      req.flash('error', 'Nutzer nicht gefunden.');
      res.redirect('back');
      break;
    case 403:
      console.log("==Frontend== User not allowed to see");
      req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
      res.redirect('back');
      break;
    case 401:
      req.flash('error', 'Du bist nicht eingeloggt.');
      res.redirect('/login');
      break;
    default:
      res.render('User/singleUser', { "user": response.data, "isSameUser": response.isSameUser, "borrows": response.borrows });
      break;
  }
});

module.exports = router;
