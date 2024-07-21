var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
