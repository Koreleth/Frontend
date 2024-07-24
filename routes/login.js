var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');


router.route('/')
    .get((req, res, next) => {
        console.log("==Frontend== Session: " + req.session.user);
        if (req.session.user) {
            res.redirect('users/' + req.session.user.id);
        }
        else {
            res.render('User/login');
        }
    })
    .post(async (req, res, next) => {

        let response = await usersController.login(req, res);
        if (response.status == 200) {
            req.session.user = response.data;
            //res.send('Hallo ' + req.session.user.username);
            res.redirect('/');
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

router.route('/logout')
    .get((req, res, next) => {
        req.session.destroy();
        console.log("==Frontend== Session destroyed");
        res.redirect('/');
    });





module.exports = router;