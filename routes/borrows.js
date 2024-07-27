/**
 * @file borrows.js
 * @description Dieses Modul enthält die Routen für die Verwaltung von Ausleihen.
 * Es kommuniziert mit dem Borrow-Controller und stellt sicher, dass nur berechtigte Benutzer
 * Zugriff auf bestimmte Funktionen haben.
 */

var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');
var utils = require('../controllers/controllerUtils');

// Route zum Abrufen aller Ausleihen
router.route('/')
    .get(async (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'Du musst eingeloggt sein, um Ausleihen zu sehen');
            res.redirect('/login');
        } else if (!utils.isAdmin(req)) {
            req.flash('error', 'Du hast keine Berechtigung, diese Seite zu sehen');
            res.redirect('back');
        } else {
            let response = await borrowController.getBorrows(req);
            res.render('Borrow/allBorrows', { "borrows": response.data });
        }
    });

// Route zum Löschen einer Ausleihe
router.route('/delete/:id')
    .post(async (req, res, next) => {
        let response = await borrowController.deleteBorrow(req);
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Ausleihen zu entfernen');
                res.redirect('/login');
                break;
            case 403:
                req.flash('error', 'Du hast keine Berechtigung, diese Ausleihe zu entfernen');
                res.redirect('/');
                break;
            case 404:
                req.flash('error', 'Diese Ausleihe existiert nicht');
                res.redirect('/borrows');
                break;
            case 200:
                req.flash('success', 'Ausleihe erfolgreich entfernt');
                res.redirect('/borrows');
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                res.redirect('/borrows');
        }
    });

// Route zum Abrufen einer einzelnen Ausleihe
router.route('/:id')
    .get(async (req, res, next) => {
        let response = await borrowController.getSingleBorrow(req);
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Ausleihen zu sehen');
                res.redirect('/login');
                break;
            case 403:
                req.flash('error', 'Du hast keine Berechtigung, diese Ausleihe zu sehen');
                res.redirect('/');
                break;
            case 404:
                req.flash('error', 'Diese Ausleihe existiert nicht');
                res.redirect('/borrows');
                break;
            case 201:
                res.render('Borrow/singleBorrow', { "borrow": response.data[0] });
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                console.log("RESPONSE von getSingleBorrow: ");
                console.log(response.status);
                res.redirect('/borrows');
        }
    });

// Routen zum Bearbeiten einer Ausleihe
router.route('/edit/:id')
    .get(async (req, res, next) => {
        let response = await borrowController.getSingleBorrow(req);
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Ausleihen zu sehen');
                res.redirect('/login');
                break;
            case 403:
                req.flash('error', 'Du hast keine Berechtigung, diese Ausleihe zu sehen');
                res.redirect('/');
                break;
            case 404:
                req.flash('error', 'Diese Ausleihe existiert nicht');
                res.redirect('/borrows');
                break;
            case 201:
                console.log("RESPONSE von getSingleBorrow: ");
                console.log(response.data[0]);
                res.render('Borrow/editBorrow', { "borrow": response.data[0] });
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                console.log("RESPONSE von getSingleBorrow: ");
                console.log(response.status);
                res.redirect('/borrows');
        }
    })
    .post(async (req, res, next) => {
        let response = await borrowController.editBorrow(req);
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Ausleihen zu bearbeiten');
                res.redirect('/login');
                break;
            case 403:
                req.flash('error', 'Du hast keine Berechtigung, diese Ausleihe zu bearbeiten');
                res.redirect('/');
                break;
            case 404:
                req.flash('error', 'Diese Ausleihe existiert nicht');
                res.redirect('/borrows');
                break;
            case 200:
                req.flash('success', 'Ausleihe erfolgreich bearbeitet');
                res.redirect('/borrows');
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                res.redirect('/borrows');
        }
    });

module.exports = router;
