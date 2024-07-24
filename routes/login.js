var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
const flash = require('express-flash');


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
            req.flash('success', 'Erfolgreich eingeloggt als ' + req.session.user.username);
            res.redirect('/');

        }
        else if (response.status == 404) {
            req.flash('error', 'Nutzer nicht gefunden');
            res.redirect('/');
        }
        else if (response.status == 400) {
            req.flash('error', 'Fehlerhafte Eingabe');
            res.redirect('/');
        }
        else {
            req.flash('error', 'Unbekannter Fehler');
            res.redirect('/');
        }

    });

router.get('/logout', function (req, res, next) {
    // Flash-Nachricht setzen
    req.flash('success', 'Erfolgreich ausgeloggt');

    // Sitzung leeren, aber nicht zerstören
    req.session.user = null;

    res.redirect('/');
});





module.exports = router;