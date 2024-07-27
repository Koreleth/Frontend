var express = require('express');
var router = express.Router();
var axios = require('axios');
var utils = require('./controllerUtils');

/**
 * Speichert eine Datei im Ordner "public/uploads" und gibt den vollständigen Pfad zurück.
 * @param {Object} file - Die hochgeladene Datei.
 * @returns {String} - Der vollständige Pfad der hochgeladenen Datei.
 */
async function saveFile(file) {
    // Verschiebt die Datei in den Ordner "public/uploads"
    await file.mv('public/uploads/' + file.name);
    // Ermittelt den vollständigen Pfad der Datei
    let filename = process.cwd() + '/public/uploads/' + file.name;
    console.log("=========================" + filename + " Uploaded =========================");
    return filename;
}

/**
 * Holt alle Equipments vom Backend und fügt Bearbeitungsrechte für Administratoren hinzu.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} - Die Antwort des Backend-Servers.
 */
const getEquipment = async (req) => {
    let response = await axios.get('http://localhost:3000/equipment');
    response.auth = false;
    // Wenn der Benutzer eingeloggt und Administrator ist, werden Bearbeitungsrechte hinzugefügt
    if (utils.auth(req)) {
        response.data.forEach(element => {
            element.edit = true;
        });
        response.auth = true;
    }
    console.log(response.data);
    // Filtert die Equipment-Daten basierend auf einer Suchanfrage
    if (req.query.search) {
        search = req.query.search;
        console.log("Search: " + search);
        const filteredData = response.data.filter(equipment => equipment.title.toLowerCase().includes(search.toLowerCase()));
        response.data = filteredData;
        console.log(response.data);
    }
    // Holt die Benutzerdaten für jedes Equipment
    for (item of response.data) {
        let userdata;
        try {
            userdata = await axios.get('http://localhost:3000/users/' + item.userid);
            item.manager = userdata.data.username;
        } catch (error) {
            item.manager = "Unbekannt";
        }
    }

    return response;
};

/**
 * Erstellt ein neues Equipment.
 * @param {Object} req - Das Anfrageobjekt.
 * @param {Object} res - Das Antwortobjekt.
 * @returns {Object} - Die Antwort des Backend-Servers.
 */
const createEquipment = async (req, res) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    }
    if (!req.files) {
        let response = await axios.post('http://localhost:3000/equipment/', req.body);
        return { "status": 200, "data": response };
    } else {
        let extensionName = req.files.file.name;
        const extension = extensionName.slice((extensionName.lastIndexOf(".") - 1 >>> 0) + 2);
        if (extension != "jpg" && extension != "jpeg" && extension != "png") {
            return { "status": 400, "data": "File must be a jpg, jpeg or png" };
        }
        let filename = await saveFile(req.files.file);
        var fs = require('fs');
        let FormData = require('form-data');
        let formData = new FormData();
        formData.append("file", fs.createReadStream(filename), { knownLength: fs.statSync(filename).size });
        formData.append("userid", req.body.userid);
        formData.append("title", req.body.title);
        formData.append("articlenumber", req.body.articlenumber);
        formData.append("description", req.body.description);
        formData.append("count", req.body.count);
        const headers = {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        };
        return axios.post('http://localhost:3000/equipment', formData, { headers })
            .then(function (response) {
                fs.unlinkSync(filename); // Datei nach dem Senden löschen
                return { "status": 200, "data": response.data };
            })
            .catch(function (error) {
                res.send(error);
            });
    }
}

/**
 * Holt ein einzelnes Equipment vom Backend.
 * @param {String} id - Die ID des Equipments.
 * @returns {Object} - Die Antwort des Backend-Servers.
 */
const getSingleEquipment = async (id) => {
    let response;
    try {
        response = await axios.get('http://localhost:3000/equipment/' + id);
    } catch (error) {
        console.log(error);
        return { "status": 404 };
    }
    return { "status": 200, "data": response.data };
}

/**
 * Löscht ein Equipment.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Object} - Die Antwort des Backend-Servers.
 */
const deleteEquipment = async (req) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    } else {
        let response = await axios.delete('http://localhost:3000/equipment/' + req.params.id);
        return response;
    }
}

/**
 * Aktualisiert ein Equipment.
 * @param {Object} req - Das Anfrageobjekt.
 * @param {Object} res - Das Antwortobjekt.
 * @returns {Object} - Die Antwort des Backend-Servers.
 */
const updateEquipment = async (req, res) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    }
    if (!req.files) {
        // Wenn keine Datei hochgeladen wird, wird nur der Body aktualisiert
        try {
            await axios.put('http://localhost:3000/equipment/' + req.body.id, req.body);
        } catch (error) {
            console.log(error);
            return { "status": 404 };
        }
        return { "status": 200 };
    } else {
        let filename = await saveFile(req.files.file);
        var fs = require('fs');
        let FormData = require('form-data');
        let formData = new FormData();
        formData.append("file", fs.createReadStream(filename), { knownLength: fs.statSync(filename).size });
        formData.append("userid", req.body.userid);
        formData.append("title", req.body.title);
        formData.append("articlenumber", req.body.articlenumber);
        formData.append("description", req.body.description);
        formData.append("count", req.body.count);
        const headers = {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        };
        return axios.put('http://localhost:3000/equipment/' + req.body.id, formData, { headers })
            .then(function (response) {
                fs.unlinkSync(filename); // Datei nach dem Senden löschen
                return { "status": 200 };
            })
            .catch(function (error) {
                res.send(error);
            });
    }
}

module.exports = {
    getEquipment,
    createEquipment,
    getSingleEquipment,
    deleteEquipment,
    updateEquipment
}
