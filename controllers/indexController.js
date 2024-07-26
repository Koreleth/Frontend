var express = require('express');
var router = express.Router();
var equipmentController = require('./equipmentController');
var axios = require('axios');

const getIndex = async (req) => {
    let data = {};
    data.items = [];
    let response = await equipmentController.getEquipment(req);
    data.items = response.data;


    data.items = response.data.slice(0, 3); // Beispiel: Nimm die ersten 3 Elemente
    data.title = "Home";
    return { "status": 200, "data": data };
}


module.exports = {
    getIndex
}