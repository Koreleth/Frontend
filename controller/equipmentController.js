var express = require('express');
var router = express.Router();

const getEquipment = async() => {
    fetch('http://localhost:3000/equipment', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json()
    .then ((equipment) => {
        let data = { "title": "All Equipments", 'equipment': equipment};
        console.log(data);
        return {"status": 200, "data": data}
    })
)}

const createEquipment = () => { 
    let data = { "title": "Equipment Created!"};;
    return {"status": 200, "data": data};
}   


module.exports = {
    getEquipment,
    createEquipment
}