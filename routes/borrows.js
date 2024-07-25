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
router.route('/create/:id')
    .get(async (req, res, next) => {
        let response = await equipmentController.getSingleEquipment(req.params.id);
        res.render('Borrow/createBorrow', { "data": response.data });
    })
    .post(async (req, res, next) => {
        let response = await borrowController.createBorrow(req);
        if (response.status == 401) {
            console.log("==Frontend== Not authorized");
            req.flash('error', 'Du bist nicht berechtigt, diese Aktion durchzuführen.');
            res.redirect('/login');
        }
        else if (response.status != 200) {
            console.log("==Frontend== Error creating borrow");
            req.flash('error', 'Fehler beim Erstellen des Borrows');
            res.redirect('/borrows/create');
        }
        else {
            req.flash('success', 'Borrow erfolgreich erstellt');
            res.redirect('/borrows/');
        }
    });
router.route('/delete/:id')
module.exports = router;