var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');
let equipmentController = require('../controllers/equipmentController');
var axios = require('axios');

router.route('/')
    .get(async (req, res, next) => {
        let response = await borrowController.getBorrows(req);
        console.log(response.data);
        res.render('Borrow/allBorrows', { "borrows": response.data });
    }); +
        router.route('/delete/:id')
module.exports = router;