var express = require('express');
var router = express.Router();
var axios = require('axios');

const getBorrows = async (res) => {
    let response;
    try {
        response = await axios.get('http://localhost:3000/borrows');
    }
    catch (error) {
        console.log(error);
    }
    return { "status": 200, "data": response };
}

module.exports = {
    getBorrows
}