var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');


router.route('/')
    .get((req, res, next) => {
        res.render('login');
    })
    .post(async (req, res, next) => {
        let response = await usersController.login(req, res);
        if (response.status == 200) {
            res.send('Hallo ' + response.data.username);
        }
        else if (response.status == 404) {
            res.send('Nutzer nicht gefunden');
        }
        else if (response.status == 400) {
            res.send('Falsches Passwort');
        }
        else {
            res.send('unbekannter Fehler');
        }
    });


router.route('/register')
    .get((req, res, next) => {
        res.render('register');
    })
    .post(async (req, res, next) => {
        let response = await usersController.register(req);
        if (response.status == 400) {
            res.send(response.data);
        }
        if (response.status == 200) {
            res.send("HURRAH")
        }
    });


module.exports = router;