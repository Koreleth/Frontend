var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');
let equipmentController = require('../controllers/equipmentController');
var axios = require('axios');

router.route('/')
    .get(async (req, res, next) => {
        let response = await borrowController.getBorrows(req);
        console.log(response.data);
        res.render('Borrow/allBorrows', { "borrows": response.data });
    });

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
module.exports = router;