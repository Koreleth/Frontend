var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');
let usersController = require('../controllers/userController');
/* GET home page. */

router.route('/')
  .get((req, res, next) => {
    let response = indexController.getIndex();
    res.render('index', { "data": response.data, title: "Dein Name ist: " + (req.session.user ? req.session.user.username : "Nicht gesetzt") });
  });




router.route('/register')
  .get((req, res, next) => {
    res.render('User/register');
  })
  .post(async (req, res, next) => {
    let response = await usersController.register(req);
    if (response.status == 400) {
      req.flash('error', response.data);
      res.redirect('/');
    }
    if (response.status == 200) {
      req.flash('success', 'Registrierung erfolgreich');
      res.redirect('/');
    }
  });
module.exports = router;

