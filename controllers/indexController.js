var express = require('express');
var router = express.Router();
var equipmentController = require('./equipmentController');
var axios = require('axios');

/**
 * Holt die Index-Daten für die Startseite.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} - Die Antwort mit Status und Daten.
 */
const getIndex = async (req) => {
    let data = {};
    data.items = [];

    // Holt die Equipment-Daten vom Equipment-Controller
    let response = await equipmentController.getEquipment(req);
    data.items = response.data;

    // Nimmt die ersten 3 Elemente aus den Equipment-Daten
    data.items = response.data.slice(0, 3); // Beispiel: Nimm die ersten 3 Elemente
    data.title = "Home";

    return { "status": 200, "data": data };
}

module.exports = {
    getIndex
}
