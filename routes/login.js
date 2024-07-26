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
        switch (response.status) {
            case 200:
                req.session.user = response.data;
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

router.get('/logout', function (req, res, next) {
    // Flash-Nachricht setzen
    req.flash('success', 'Erfolgreich ausgeloggt');

    // Sitzung leeren, aber nicht zerstören
    req.session.user = null;

    res.redirect('/');
});





module.exports = router;