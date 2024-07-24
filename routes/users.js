var express = require('express');
var router = express.Router();
var usersController = require('../controllers/userController');
/* GET users listing. */
router.get('/', async function (req, res, next) {
  //Man kann nur auf die Seite zugreifen wenn man eingeloggt ist
  //Und Admin ist
  if (!req.session.user) {
    res.redirect('/login');
  }
  else if (req.session.user.role != 'Administrator') {
    console.log("==Frontend== User not allowed to see all users");
    res.redirect('back');
  }

  let users = await usersController.getAllUsers();
  //res.send(users);
  res.render('User/users', { "users": users.data });
});


router.route('/edit/:id')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req);
    //Wenn nicht eingeloggt
    if (response.status == 401) {
      res.redirect('/login');
    }
    //Wenn nicht gefunden
    if (response.status == 404) {
      res.send('Nutzer nicht gefunden');
    }
    if (response.status == 403) {
      console.log("==Frontend== User not allowed to edit");
      res.redirect('back');
    }

    //res.send(response.data);
    res.render('User/editUser', { "user": response.data });
  })
  .post(async (req, res, next) => {
    let response = await usersController.updateUser(req);
    console.log(response);
    res.send(response.data);
  });

router.route('/delete/:id')
  .get(async (req, res, next) => {
    let response = await usersController.getUser(req);
    if (response.status == 404) {
      res.send('Nutzer nicht gefunden');
    }
    if (response.status == 403) {
      console.log("==Frontend== User not allowed to delete");
      res.redirect('back');
    }
    if (response.status == 401) {
      res.redirect('/login');
    }
    //res.send(response.data);
    res.render('User/deleteUser', { "user": response.data });
  })
  .post(async (req, res, next) => {
    let response = await usersController.deleteUser(req);
    console.log(response);
    res.send(response.data);
  });

router.get('/:id', async function (req, res, next) {
  let response = await usersController.getUser(req);
  console.log(response);
  if (response.status == 404) {
    res.send('Nutzer nicht gefunden');
  }
  if (response.status == 403) {
    console.log("==Frontend== User not allowed to see");
    res.redirect('back');
  }
  if (response.status == 401) {
    res.redirect('/login');
  }
  res.render('User/singleUser', { "user": response.data, "isSameUser": response.isSameUser });
});

module.exports = router;
