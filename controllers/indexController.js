var express = require('express');
var router = express.Router();

const getIndex = () => {
    let data = { "title": "Gadget-Rent"};;
    return {"status": 200, "data": data};
}


module.exports = {
    getIndex
}