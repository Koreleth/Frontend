var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');
let usersController = require('../controllers/userController');
/* GET home page. */

router.route('/')
  .get(async (req, res, next) => {
    let response = await indexController.getIndex(req);
    console.log(response.data);
    res.render('index', { "popularItems": response.data.items, title: response.title });
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

