var express = require('express');
var router = express.Router();
var axios = require('axios');
var utils = require('./controllerUtils');

/**
 * Fetches all borrows from the backend.
 * @param {Object} res - The response object.
 * @returns {Object} - The status and formatted borrows data.
 */
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
    let borrows = response.data;
    borrows = await formatBorrows(borrows);
    console.log(borrows);
    return { "status": 200, "data": borrows };
}

/**
 * Formats borrows by fetching and attaching related user and equipment data.
 * @param {Array} borrows - The borrows data to format.
 * @returns {Array} - The formatted borrows data.
 */
const formatBorrows = async (borrows) => {
    for (let item of borrows) {
        let userdata = await axios.get('http://localhost:3000/users/' + item.userid);
        item.manager = { id: userdata.data.id, name: userdata.data.username };
        item.equipments = [];
        for (let equipmentid of item.equipmentids) {
            let equipmentdata = await axios.get('http://localhost:3000/equipment/' + equipmentid);
            item.equipments.push({ id: equipmentdata.data.id, title: equipmentdata.data.title });
        }
        delete item.equipmentids;
        delete item.userid;
    }
    return borrows;
}

/**
 * Gets the current cart items for the logged-in user.
 * @param {Object} req - The request object.
 * @returns {Object} - The status and cart items data.
 */
const getCart = async (req) => {
    let cartItems = [];
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!req.session.user.cart || req.session.user.cart.length <= 0) {
        req.session.user.cart = [];
    } else {
        console.log("CART IDS: " + req.session.user.cart);
        for (let item of req.session.user.cart) {
            let response = await axios.get('http://localhost:3000/equipment/' + item);
            cartItems.push(response.data);
        }
    }
    return { "status": 200, "data": cartItems };
}

/**
 * Adds an item to the user's cart.
 * @param {Object} req - The request object.
 * @returns {Object} - The status and added item data.
 */
const addToCart = async (req) => {
    console.log("SESSION: " + req.session.user);
    if (!req.session.user) {
        return { "status": 401 };
    }
    let response = await axios.get('http://localhost:3000/equipment/' + req.params.id);
    if (response.status == 404) {
        return { "status": 404 };
    } else {
        if (!req.session.user.cart) {
            req.session.user.cart = [];
        }
        let count = 0;
        req.session.user.cart.forEach((v) => (v === req.params.id && count++));
        if (count >= response.data.count) {
            return { "status": 409, "data": "Nicht genügend Geräte auf Lager" };
        } else {
            let cart = req.session.user.cart;
            if (!cart) {
                cart = [];
            }
            cart.push(req.params.id);
            req.session.user.cart = cart;
            return { "status": 200, "data": response.data };
        }
    }
}

/**
 * Removes an item from the user's cart.
 * @param {Object} req - The request object.
 * @returns {Object} - The status.
 */
const removeFromCart = async (req) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    let cart = req.session.user.cart;
    let index = cart.indexOf(req.params.id);
    if (index > -1) {
        cart.splice(index, 1);
    } else {
        return { "status": 404 };
    }
    req.session.user.cart = cart;
    return { "status": 200 };
}

/**
 * Checks out the items in the user's cart, creating a new borrow record.
 * @param {Object} req - The request object.
 * @returns {Object} - The status and message.
 */
const checkout = async (req) => {
    if (!req.session.user.cart || req.session.user.cart.length <= 0) {
        return { "status": 404 };
    }
    let borrow = {
        "userid": req.session.user.id,
        "equipmentids": req.session.user.cart,
        "start": req.body.start,
        "end": req.body.end
    }
    // Check if the borrow start date is in the past
    if (new Date(borrow.start + 1) < new Date().setHours(0, 0, 0, 0)) {
        return { "status": 409, "data": "Startdatum liegt in der Vergangenheit" };
    }
    console.log("CART:");
    console.log(req.session.user.cart);
    let invUpdate = await updateInventory(req.session.user.cart, true);
    if (invUpdate.status != 200) {
        return { "status": invUpdate.status, "data": invUpdate.data };
    }
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
    } else {
        console.log(response.data);
        return { "status": response.status, "data": response.data };
    }
}

/**
 * Updates the inventory count for the specified items.
 * @param {Array} inventory - The list of inventory item IDs to update.
 * @param {Boolean} subtract - Whether to subtract from the inventory count.
 * @returns {Object} - The status and data.
 */
const updateInventory = async (inventory, subtract) => {
    if (!inventory || inventory.length <= 0 || !Array.isArray(inventory)) {
        return;
    }
    console.log("INVENTORY: ");
    console.log(inventory);
    for (let item of inventory) {
        console.log("ITEM: " + item);
        let requestedItem = await axios.get('http://localhost:3000/equipment/' + item);
        let targetItem = requestedItem.data;
        console.log("TARGET ITEM: ");
        console.log(targetItem);
        let updatedItem = {
            "title": targetItem.title,
            "description": targetItem.description,
            "articlenumber": targetItem.articlenumber,
            "userid": targetItem.userid,
        }
        if (subtract) {
            updatedItem.count = targetItem.count - 1;
        } else {
            updatedItem.count = targetItem.count + 1;
        }
        console.log("UPDATE BODY: ");
        console.log(updatedItem);

        let response;
        try {
            response = await axios.put('http://localhost:3000/equipment/' + targetItem.id, updatedItem);
        }
        catch (error) {
            console.log("Error updating equipment: " + item);
            return { "status": error.response.status, "data": error.response.data };
        }
        if (response.status == 200) {
            console.log("Equipment updated: " + item);
        } else if (response.status != 200) {
            console.log("Error updating equipment: " + item);
            return { "status": response.status, "data": response.data };
        }
    }
    return { "status": 200 };
}

/**
 * Deletes a borrow record.
 * @param {Object} req - The request object.
 * @returns {Object} - The status.
 */
const deleteBorrow = async (req) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    let response;
    let borrow;
    try {
        borrow = await axios.get('http://localhost:3000/borrows/' + req.params.id);
        response = await axios.delete('http://localhost:3000/borrows/' + req.params.id);
    }
    catch (error) {
        console.log(error);
        return { "status": error.response.status, "data": error.response.data };
    }
    if (response.status == 200) {
        console.log("Borrow deleted: " + req.params.id);
        await updateInventory(borrow.data.equipmentids, false);
    } else {
        console.log(response.data);
        return { "status": response.status, "data": response.data };
    }
    return { "status": response.status };
}

/**
 * Gets a single borrow record by ID.
 * @param {Object} req - The request object.
 * @returns {Object} - The status and borrow data.
 */
const getSingleBorrow = async (req) => {
    let response;
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!utils.isAdmin(req) && !utils.isSameUser(req)) {
        return { "status": 403 };
    }
    try {
        response = await axios.get('http://localhost:3000/borrows/' + req.params.id);
    }
    catch (error) {
        console.log(error);
        return { "status": error.response.status, "data": error.response.data };
    }
    if (response.status == 200) {
        console.log("Borrow found: " + req.params.id);
    } else {
        console.log("RESPONSE DATA: ");
        console.log(response.data);
        response.data = await formatBorrows([response.data]);
        return { "status": response.status, "data": response.data };
    }
    return { "status": response.status, "data": response.data[0] };
}

/**
 * Edits a borrow record.
 * @param {Object} req - The request object.
 * @returns {Object} - The status.
 */
const editBorrow = async (req) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!utils.isAdmin(req) && !utils.isSameUser(req)) {
        return { "status": 403 };
    }
    let response;
    let borrow = await axios.get('http://localhost:3000/borrows/' + req.params.id);
    let equipmentids = borrow.data.equipmentids;
    let input = {
        "userid": req.body.userid,
        "equipmentids": equipmentids,
        "start": req.body.start,
        "end": req.body.end
    }
    console.log("INPUT: ");
    console.log(input.start);
    console.log(input.end);
    try {
        response = await axios.put('http://localhost:3000/borrows/' + req.params.id, input);
    }
    catch (error) {
        console.log(error);
        return { "status": error.response.status, "data": error.response.data };
    }
    if (response.status == 200) {
        console.log("Borrow updated: " + req.params.id);
    } else {
        console.log(response.data);
        return { "status": response.status, "data": response.data };
    }
    return { "status": response.status };
}

module.exports = {
    getBorrows,
    getCart,
    addToCart,
    removeFromCart,
    checkout,
    deleteBorrow,
    getSingleBorrow,
    editBorrow
}
