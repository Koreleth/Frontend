var express = require('express');
var router = express.Router();
var axios = require('axios');

const auth = (req) => {
    if (req.session.user.role == "Administrator") {
        return true;
    }
    if (req.session.user.id == req.params.id) {
        return true;
    }
    return false;

}
const getAllUsers = async () => {
    console.log("==Frontend== getting all users from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users');
    }
    catch (error) {
        //console.log(error);
        console.log('\x1b[31m' + "==Frontend== ERROR FINDING USERS" + '\x1b[0m');
        return { "status": 404 };
    }
    console.log("==Frontend== Status: " + response.status);
    console.log(response.data);
    return { "status": 200, "data": response.data };

};
//User aus Backend holen
const getUser = async (req) => {
    let request;
    if (!req.session.user) {
        return { "status": 401 };
    }
    if (!auth(req)) {
        return { "status": 403 };
    }

    console.log("==Frontend== getting user from Backend");
    let response;
    try {
        response = await axios.get('http://localhost:3000/users/' + req.params.id);
    }
    catch (error) {
        //console.log(error);
        console.log('\x1b[31m' + "==Frontend== USER NOT FOUND! EXITING WITH 404" + '\x1b[0m');
        return { "status": 404 }
    }
    console.log("==Frontend== Status: " + response.status);
    console.log(response.data);

    //Wenn Array, dann nur ein Element zurückgeben
    if (Array.isArray(response.data)) {
        return { "status": 200, "data": response.data[0] };
    }
    //Wenn Objekt, dann direkt zurückgeben
    return { "status": 200, "data": response.data };

}

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

//MAN KANN SICH NUR SELBER UPDATEN
//NUR ADMINS KÖNNEN ANDERE KÖNNEN ANDERE UPDATEN
//NUR ADMINS KÖNNEN ROLLE ÄNDERN
const updateUser = async (req) => {
    //Nutzerdaten auf Backend updaten
    console.log('==Frontend== Sending PUT request to Backend');
    let response;
    console.log("==Frontend== Body: ");
    console.log(req.body);
    let checkuser = await axios.get('http://localhost:3000/users/' + req.body.id);
    if (checkuser.status == 404) {
        return { "status": 404, "data": "Nutzer nicht gefunden" };
    }
    //PUT Request darf nicht selbern Nutzernamen enthalten wie existierender Nutzer
    if (checkuser.data.username == req.body.username) {
        delete req.body.username; //Nutzername aus Objekt löschen
    }
    try {
        console.log("==Frontend== Sending PUT request to Backend");
        if (req.session.user) {
            if (checkuser.data.id == req.session.user.id) {
                req.session.destroy();
            }
        }
        response = await axios.put('http://localhost:3000/users/' + req.body.id, req.body);
    }
    catch (error) {
        //console.log(error);
        console.log(error);
        return { "status": 400, "data": error.response };
    }
    return { "status": 200, "data": "Nutzer bearbeitet" };
}

//NUR ADMINS KÖNNEN ANDERE NUTZER LÖSCHEN
//NUTZER KÖNNEN NUR SICH SELBST LÖSCHEN
const deleteUser = async (req) => {
    //Nutzerdaten auf Backend updaten
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
    }
    catch (error) {
        //console.log(error);
        //console.log(error.response.data);
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