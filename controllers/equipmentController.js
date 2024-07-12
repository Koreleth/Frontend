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

const createEquipment = async () => { 
    try {
        const response = await fetch('http://localhost:3000/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        //DOING SOMETING WITH THE RESPONSE
        return { "status": 200, "data": data };
    } catch (error) {
        console.error('Error creating equipment:', error);
        return { "status": 500, "data": { "title": "Error", "equipment": [] } };
    }
}   

const getSingleEquipment = () => {
    let data = { "title": "Single Equipment"};
    return {"status": 200, "data": data};
}

module.exports = {
    getEquipment,
    createEquipment,
    getSingleEquipment
}