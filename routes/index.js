var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');
let usersController = require('../controllers/userController');
/* GET home page. */

router.route('/')
  .get((req, res, next) => {
    let response = indexController.getIndex();
    res.render('index', { "data": response.data, title: 'Home' });
  });

router.route('/register')
  .get((req, res, next) => {
    res.render('User/register');
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

