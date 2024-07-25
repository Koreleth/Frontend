var express = require('express');
var router = express.Router();
var axios = require('axios');
var utils = require('./controllerUtils');

const getBorrows = async (res) => {
    let response;
    try {
        response = await axios.get('http://localhost:3000/borrows');
        console.log(response.data);
    }
    catch (error) {
        console.log(error);
    }
    const borrows = response.data;
    for (item of borrows) {
        userdata = await axios.get('http://localhost:3000/users/' + item.userid);
        item.manager = { id: userdata.data.id, name: userdata.data.username };
        item.equipments = [];
        for (equipmentid of item.equipmentids) {
            let equipmentdata = await axios.get('http://localhost:3000/equipment/' + equipmentid);
            item.equipments.push({ id: equipmentdata.data.id, title: equipmentdata.data.title });
        };
        delete item.equipmentids;
        delete item.userid;
    };

    return { "status": 200, "data": borrows };
}
const createBorrow = async (req) => {
    if (!utils.auth(req)) {
        return { "status": 401 };
    }
    let response;
    try {
        response = await axios.post('http://localhost:3000/borrows', req.body);
    }
    catch (error) {
        console.log(error);
        return { "status": 404 }
    }
    return { "status": 200 };
}

module.exports = {
    getBorrows
}