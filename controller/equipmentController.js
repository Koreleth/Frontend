var express = require('express');
var router = express.Router();


//need to fix: 
const getEquipment = async () => {
    try {
        const response = await fetch('http://localhost:3000/equipment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const equipment = await response.json();
        let data = { "title": "All Equipments", 'equipment': equipment };
        console.log(data);
        return { "status": 200, "data": data };
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return { "status": 500, "data": { "title": "Error", "equipment": [] } };
    }
};

const createEquipment = () => { 
    let data = { "title": "Equipment Created!"};;
    return {"status": 200, "data": data};
}   


module.exports = {
    getEquipment,
    createEquipment
}