var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');

router.route('/')
    .get(async (req, res, next) => {
        let response = await borrowController.getCart(req);
        console.log("CART IDS: " + response.data);
        if (response.status == 401) {
            req.flash('error', 'Du musst eingeloggt sein, um den Warenkorb zu sehen');
            res.redirect('/login');
        }
        res.render('Borrow/cart', { "cart": response.data });
    });

router.route('/add/:id')
    .get(async (req, res, next) => {
        let response = await borrowController.addToCart(req);
        console.log(response.data);
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
            default:
                req.flash('error', 'Ein Fehler ist aufgetreten');
                res.redirect('/equipment');
                break;
        }

    });

router.route('/remove/:id')
    .post(async (req, res, next) => {
        let response = await borrowController.removeFromCart(req);
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

router.route('/checkout')
    .post(async (req, res, next) => {
        console.log("CHECKOUT");
        let response = await borrowController.checkout(req);
        if (response.status != 201) {
            req.flash('error', response.data);
            res.redirect('/cart');
        }
        else {
            req.flash('success', response.data);
            res.redirect('/');

        }
    });
module.exports = router;