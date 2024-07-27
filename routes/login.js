/**
 * @file login.js
 * @description Dieses Modul enthält die Routen für Benutzeraktionen wie Login und Logout. Es kommuniziert mit dem Benutzer-Controller.
 */

var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
const flash = require('express-flash');

/**
 * Route für den Login
 */
router.route('/')
    .get((req, res, next) => {
        console.log("==Frontend== Session: " + req.session.user);
        // Wenn der Benutzer bereits eingeloggt ist, wird er zu seiner Profilseite weitergeleitet
        if (req.session.user) {
            res.redirect('users/' + req.session.user.id);
        } else {
            // Ansonsten wird die Login-Seite angezeigt
            res.render('User/login');
        }
    })
    .post(async (req, res, next) => {
        // Versucht, den Benutzer einzuloggen
        let response = await usersController.login(req, res);
        // Überprüft den Status der Antwort und handelt entsprechend
        switch (response.status) {
            case 200:
                req.session.user = response.data;
                req.session.user.cart = [];
                req.flash('success', 'Erfolgreich eingeloggt als ' + req.session.user.username);
                res.redirect('/');
                break;
            case 404:
                req.flash('error', 'Nutzer nicht gefunden');
                res.redirect('back');
                break;
            case 400:
                req.flash('error', 'Falsches Passwort');
                res.redirect('back');
                break;
            default:
                req.flash('error', 'Unbekannter Fehler');
                res.redirect('back');
                break;
        }
    });

/**
 * Route für den Logout
 */
router.get('/logout', function (req, res, next) {
    // Flash-Nachricht setzen
    req.flash('success', 'Erfolgreich ausgeloggt');

    // Sitzung leeren, aber nicht zerstören
    req.session.user = null;

    // Umleitung zur Startseite
    res.redirect('/');
});

module.exports = router;
