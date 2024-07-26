var express = require('express');
var router = express.Router();
var equipmentController = require('./equipmentController');
var axios = require('axios');

const getIndex = async () => {
    let data = {};
    data.items = [];
    let response = await axios.get('http://localhost:3000/equipment');
    data.items = response.data;


    data.items = response.data.slice(0, 3); // Beispiel: Nimm die ersten 3 Elemente
    data.title = "Home";
    return { "status": 200, "data": data };
}


module.exports = {
    getIndex
}