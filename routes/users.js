var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
/* GET users listing. */
router.get('/', async function (req, res, next) {
  let users = await usersController.getAllUsers();
  //res.send(users);
  res.render('users', { "users": users.data });
});

router.route('/edit')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req);
    if (response.status == 404) {
      res.send('Nutzer nicht gefunden');
    }
    //res.send(response.data);
    res.render('editUser', { "user": response.data });
  })
  .post(async (req, res, next) => {
    let response = await usersController.updateUser(req);
    console.log(response);
    res.send(response.data);
  });

router.route('/delete')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req);
    if (response.status == 404) {
      res.send('Nutzer nicht gefunden');
    }
    //res.send(response.data);
    res.render('deleteUser', { "user": response.data });
  })
  .post(async (req, res, next) => {
    let response = await usersController.deleteUser(req);
    console.log(response);
    res.send(response.data);
  });

module.exports = router;
