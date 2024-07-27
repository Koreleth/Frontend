/**
 * @file cart.js
 * @description Dieses Modul enthält die Routen für die Verwaltung des Warenkorbs.
 * Es kommuniziert mit dem Borrow-Controller und stellt sicher, dass nur berechtigte Benutzer
 * Zugriff auf bestimmte Funktionen haben.
 */

var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');

// Route zum Anzeigen des Warenkorbs
router.route('/')
    .get(async (req, res, next) => {
        let response = await borrowController.getCart(req);
        console.log("CART IDS: " + response.data);

        // Wenn der Benutzer nicht eingeloggt ist, wird er zur Login-Seite weitergeleitet
        if (response.status == 401) {
            req.flash('error', 'Du musst eingeloggt sein, um den Warenkorb zu sehen');
            res.redirect('/login');
        } else {
            res.render('Borrow/cart', { "cart": response.data });
        }
    });

// Route zum Hinzufügen eines Geräts zum Warenkorb
router.route('/add/:id')
    .get(async (req, res, next) => {
        let response = await borrowController.addToCart(req);
        console.log(response.data);

        // Abhängig vom Statuscode der Antwort wird eine entsprechende Nachricht angezeigt
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Geräte auszuleihen');
                res.redirect('/login');
                break;
            case 404:
                req.flash('error', 'Dieses Equipment existiert nicht');
                res.redirect('/equipment');
                break;
            case 200:
                console.log("RESPONSE: " + response.data);
                req.flash('success', response.data.title + ' erfolgreich hinzugefügt');
                res.redirect('/equipment');
                break;
            case 409:
                req.flash('error', 'Du kannst nicht mehr Geräte ausleihen als verfügbar sind');
                res.redirect('/equipment');
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                res.redirect('/equipment');
                break;
        }
    });

// Route zum Entfernen eines Geräts aus dem Warenkorb
router.route('/remove/:id')
    .post(async (req, res, next) => {
        let response = await borrowController.removeFromCart(req);

        // Abhängig vom Statuscode der Antwort wird eine entsprechende Nachricht angezeigt
        switch (response.status) {
            case 401:
                req.flash('error', 'Du musst eingeloggt sein, um Geräte auszuleihen');
                res.redirect('/login');
                break;
            case 404:
                req.flash('error', 'Dieses Equipment existiert nicht');
                res.redirect('/equipment');
                break;
            case 200:
                req.flash('success', 'Equipment erfolgreich entfernt');
                res.redirect('/cart');
                break;
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                res.redirect('/equipment');
                break;
        }
    });

// Route zum Abschließen des Warenkorbs und Erstellen einer Ausleihe
router.route('/checkout')
    .post(async (req, res, next) => {
        console.log("CHECKOUT");
        let response = await borrowController.checkout(req);

        // Wenn der Checkout nicht erfolgreich ist, wird eine Fehlermeldung angezeigt
        if (response.status != 201) {
            req.flash('error', response.data);
            res.redirect('/cart');
        } else {
            req.flash('success', response.data);
            res.redirect('/');
        }
    });

module.exports = router;
