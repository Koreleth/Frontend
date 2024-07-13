var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');

/* GET home page. */

router.route('/')
.get ((req,res,next) => {
  let response = indexController.getIndex();
  console.log (response);
  res.render('index', { "data": response.data});
});


module.exports = router;

