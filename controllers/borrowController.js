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
        res.send(error.response.data);
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
    }
    console.log(borrows);
    return { "status": 200, "data": borrows };
}



const getCart = async (req) => {
    let cartItems = [];
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!req.session.user.cart || req.session.user.cart.length <= 0) {
        req.session.user.cart = [];
    }
    else {
        console.log("CART IDS: " + req.session.user.cart);
        for (item of req.session.user.cart) {
            let response = await axios.get('http://localhost:3000/equipment/' + item);
            cartItems.push(response.data);
        }
    }
    return { "status": 200, "data": cartItems };
}
const addToCart = async (req) => {
    console.log("SESSION: " + req.session.user);
    if (!req.session.user) {
        return { "status": 401 };
    }
    let response = await axios.get('http://localhost:3000/equipment/' + req.params.id);
    if (response.status == 404) {
        return { "status": 404 };
    }
    else {
        let cart = req.session.user.cart;
        if (!cart) {
            cart = [];
        }
        cart.push(req.params.id);
        req.session.user.cart = cart;
        return { "status": 200, "data": response.data };
    }
}

const removeFromCart = async (req) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    let cart = req.session.user.cart;
    let index = cart.indexOf(req.params.id);
    if (index > -1) {
        cart.splice(index, 1);
    }
    else {
        return { "status": 404 };
    }
    req.session.user.cart = cart;
    return { "status": 200 };

}

const checkout = async (req) => {
    if (!req.session.user.cart || req.session.user.cart.length <= 0) {
        return { "status": 404 };
    }
    let borrow = {
        "userid": req.session.user.id,
        "equipmentids": req.session.user.cart,
        //heutiges datum als ISO date ohne uhrzeit
        //fälligkeitsdatum 2 wochen
        /*"start": new Date().toISOString().split('T')[0],
        "end": new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]*/
        "start": req.body.start,
        "end": req.body.end
    }
    console.log(borrow);
    let response;
    try {
        response = await axios.post('http://localhost:3000/borrows', borrow);
    }
    catch (error) {
        console.log(error);
        return { "status": error.response.status, "data": error.response.data };
    }
    if (response.status == 201) {
        req.session.user.cart = [];
        return { "status": 201, "data": "Ausleihe erfolgreich" };
    }
    else {
        console.log(response.data);
        return { "status": response.status, "data": response.data };
    }
}

const deleteBorrow = async (req) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    let response;
    try {
        response = await axios.delete('http://localhost:3000/borrows/' + req.params.id);
    }
    catch (error) {
        console.log(error);
        return { "status": error.response.status, "data": error.response.data };
    }
    return { "status": response.status };

}
module.exports = {
    getBorrows,
    getCart,
    addToCart,
    removeFromCart,
    checkout,
    deleteBorrow
}