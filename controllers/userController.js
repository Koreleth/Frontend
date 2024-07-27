/**
 * @file userController.js
 * @description Dieses Modul enthält Funktionen zur Verwaltung und Bearbeitung von Benutzerdaten.
 * Es kommuniziert mit dem Backend, um Benutzer zu erstellen, zu aktualisieren, zu löschen und zu authentifizieren.
 * Außerdem holt es Ausleihvorgänge eines Benutzers vom Backend.
 */

var express = require('express');
var router = express.Router();
var axios = require('axios');
var utils = require('./controllerUtils');
var borrowsController = require('./borrowController');

/**
 * Holt alle Benutzer vom Backend.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const getAllUsers = async () => {
    console.log("==Frontend== Getting all users from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users');
    } catch (error) {
        console.log('\x1b[31m' + "==Frontend== ERROR FINDING USERS" + '\x1b[0m');
        return { "status": 404 };
    }
    console.log("==Frontend== Status: " + response.status);
    console.log(response.data);
    return { "status": 200, "data": response.data };
};

/**
 * Holt einen Benutzer basierend auf der ID aus dem Backend.
 * @param {Object} req - Das Anfrageobjekt.
 * @param {Object} res - Das Antwortobjekt.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const getUser = async (req, res) => {
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!utils.auth(req)) {
        return { "status": 403 };
    }

    console.log("==Frontend== Getting user from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users/' + req.params.id);
    } catch (error) {
        console.log('\x1b[31m' + "==Frontend== USER NOT FOUND! EXITING WITH 404" + '\x1b[0m');
        return { "status": 404 };
    }
    console.log("==Frontend== Status: " + response.status);
    console.log(response.data);

    let out;
    // Wenn Array, dann nur ein Element zurückgeben
    if (Array.isArray(response.data)) {
        out = { "status": 200, "data": response.data[0] };
    } else { // Wenn Objekt, dann direkt zurückgeben
        out = { "status": 200, "data": response.data };
    }

    out.isSameUser = utils.isSameUser(req);
    out.borrows = await getUserborrows(req, res, response.data.id);
    return out;
}

/**
 * Holt die Ausleihvorgänge eines Benutzers.
 * @param {Object} req - Das Anfrageobjekt.
 * @param {Object} res - Das Antwortobjekt.
 * @param {string} userid - Die ID des Benutzers.
 * @returns {Array} Eine Liste der Ausleihvorgänge des Benutzers.
 */
const getUserborrows = async (req, res, userid) => {
    let response;
    try {
        response = await borrowsController.getBorrows(res);
    } catch (error) {
        console.log(error);
        return { "status": 404 };
    }
    const borrows = response.data;
    console.log("==Frontend== BORROWS: ");
    console.log(borrows);

    let out = [];
    for (let item of borrows) {
        if (item.manager.id == userid) {
            out.push(item);
        }
    }
    console.log("==Frontend== USER BORROWS: ");
    console.log(out);
    return out;
}

/**
 * Führt den Login eines Benutzers durch.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const login = async (req) => {
    console.log("==Frontend== Getting user from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users/byName?username=' + req.body.username);
    } catch (error) {
        console.log('\x1b[31m' + "==Frontend== USER NOT FOUND! EXITING WITH 404" + '\x1b[0m');
        return { "status": 404 };
    }

    console.log("==Frontend== Status: " + response.status);
    console.log(response.data[0]);

    // Abfrage ob Password richtig
    if (response.data[0].password == req.body.password) {
        // Benutzerdaten stimmen überein
        return { "status": 200, "data": response.data[0] };
    }

    // Falsches Passwort
    console.log('\x1b[31m' + "==Frontend== WRONG PASSWORD! EXITING WITH 400" + '\x1b[0m');
    return { "status": 400, "data": response.data };
}

/**
 * Registriert einen neuen Benutzer.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const register = async (req) => {
    console.log('==Frontend== Sending POST request to Backend');
    let response;
    console.log("==Frontend== Body: ");
    console.log(req.body);
    try {
        response = await axios.post('http://localhost:3000/users', req.body);
    } catch (error) {
        console.log(error.response.data);
        return { "status": 400, "data": error.response.data };
    }

    console.log("==Frontend== Backend status: " + response.status);
    if (response.status != 201) {
        return { "status": 400, "data": "FEHLER" };
    }
    console.log("==Frontend== User created!");
    delete req.session.user;
    return { "status": 200, "data": "HURRAH" };
}

/**
 * Aktualisiert einen Benutzer.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const updateUser = async (req) => {
    console.log('==Frontend== Sending PUT request to Backend');
    let response;
    console.log("==Frontend== Body: ");
    console.log(req.body);
    let checkuser = await axios.get('http://localhost:3000/users/' + req.body.id);
    if (checkuser.status == 404) {
        return { "status": 404, "data": "Nutzer nicht gefunden" };
    }
    // PUT Request darf nicht denselben Nutzernamen enthalten wie existierender Nutzer
    if (checkuser.data.username == req.body.username) {
        delete req.body.username; // Nutzername aus Objekt löschen
    }
    try {
        console.log("==Frontend== Sending PUT request to Backend");
        if (req.session.user) {
            if (checkuser.data.id == req.session.user.id) {
                req.session.destroy();
            }
        }
        response = await axios.put('http://localhost:3000/users/' + req.body.id, req.body);
    } catch (error) {
        console.log(error);
        return { "status": 400, "data": error.response };
    }
    return { "status": 200, "data": "Nutzer bearbeitet" };
}

/**
 * Löscht einen Benutzer.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} Ein Objekt mit dem Status und den Benutzerdaten.
 */
const deleteUser = async (req) => {
    console.log('==Frontend== Sending DELETE request to Backend');
    let response;
    console.log("==Frontend== Body: ");
    console.log(req.body);
    let checkuser = await axios.get('http://localhost:3000/users/' + req.body.id);
    if (checkuser.status == 404) {
        return { "status": 404, "data": "Nutzer nicht gefunden" };
    }
    try {
        response = await axios.delete('http://localhost:3000/users/' + req.body.id);
    } catch (error) {
        console.log(error.response.data);
        return { "status": 400, "data": error.response.data };
    }
    return { "status": 200, "data": "Nutzer gelöscht" };
}

module.exports = {
    getAllUsers,
    getUser,
    login,
    register,
    updateUser,
    deleteUser
}
