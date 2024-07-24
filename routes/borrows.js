var express = require('express');
var router = express.Router();
let borrowController = require('../controllers/borrowController');

router.route('/')
    .get(async (req, res, next) => {
        let response = await borrowController.getBorrows(res);
        const borrows = response.data;
        console.log(borrows.data);
        res.render('Borrow/allBorrows', { "borrows": borrows.data });
    })

module.exports = router;