var express = require('express');
var router = express.Router();
var axios = require('axios');

const login = async (req) => {
    console.log("==Frontend== getting user from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users/byName?username=' + req.body.username);
    }
    //Nutzer exisitert nicht
    catch (error) {
        //console.log(error);
        console.log('\x1b[31m' + "==Frontend== USER NOT FOUND! EXITING WITH 404" + '\x1b[0m');
        return { "status": 404 }
    }
    //Nutzer exisitert
    console.log("==Frontend== Status: " + response.status);
    console.log(response.data[0]);
    //Abfrage ob Password richtig
    if (response.data[0].password == req.body.password) {
        //Benutzerdaten stimmen überein
        return { "status": 200, "data": response.data[0] };
    }
    //Falsches Passwort -> normalerweise sollte man nicht zwischen falscher Name und falsches Passwort unterscheiden
    //Aus Gründen der benutzbarkeit macht es hier aber Sinn, weil keine öffentliche Applikation ;)
    console.log('\x1b[31m' + "==Frontend== WRONG PASSWORD! EXITING WITH 400" + '\x1b[0m');
    return { "status": 400, "data": response.data };
}

const register = async (req) => {
    console.log('==Frontend== Sending POST request to Backend');
    let response;
    console.log("==Frontend== Body: ");
    console.log(req.body);
    try {
        response = await axios.post('http://localhost:3000/users', req.body);
    }
    catch (error) {
        //console.log(error);
        console.log(error.response.data);
        return { "status": 400, "data": error.response.data };
    }

    console.log("==Frontend== Backend status: " + response.status);
    if (response.status != 201) {
        return { "status": 400, "data": "FEHLER" };
    }
    console.log("==Frontend== User created!")
    return { "status": 200, "data": "HURRAH" };
}

//MAN KANN SICH NUR SELER UPDATEN
//NUR ADMINS KÖNNEN ANDERE KÖNNEN ANDERE UPDATEN
//NUR ADMINS KÖNNEN ROLLE ÄNDERN
const updateUser = async (req) => {

}

//NUR ADMINS KÖNNEN ANDERE NUTZER LÖSCHEN
//NUTZER KÖNNEN NUR SICH SELBST LÖSCHEN
const deleteUser = async (req) => {

}

module.exports = {
    login,
    register,
    updateUser
}