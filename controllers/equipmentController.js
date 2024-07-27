var express = require('express');
var router = express.Router();
var axios = require('axios');
var utils = require('./controllerUtils');

async function saveFile(file) {
    //move the file to the public/uploads folder
    await file.mv('public/uploads/' + file.name);
    //get the complete path of the file
    let filename = process.cwd() + '/public/uploads/' + file.name;
    console.log("=========================" + filename + " Uploaded =========================");
    return filename;
}

//Holt sich vom Backend alle Equipments
const getEquipment = async (req) => {
    let response = await axios.get('http://localhost:3000/equipment');
    response.auth = false;
    //Wenn der User eingeloggt ist und Admin ist, dann wird der Edit Button angezeigt
    //Und neue Einträge dürfen erstellt werden
    if (utils.auth(req)) {
        response.data.forEach(element => {
            element.edit = true;
        });
        response.auth = true;
    }
    console.log(response.data);
    if (req.query.search) {
        search = req.query.search;
        console.log("Search: " + search);
        const filteredData = response.data.filter(equipment => equipment.title.toLowerCase().includes(search.toLowerCase()));
        response.data = filteredData;
        console.log(response.data);
    }
    for (item of response.data) {
        let userdata = await axios.get('http://localhost:3000/users/' + item.userid);
        item.manager = userdata.data.username;
    }
    return response;

};


const createEquipment = async (req, res) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    }
    if (!req.files) {
        let response = await axios.post('http://localhost:3000/equipment/', req.body)

        return { "status": 200, "data": response };

    } else {
        let extensionName = req.files.file.name;
        const extension = extensionName.slice((extensionName.lastIndexOf(".") - 1 >>> 0) + 2)
        if (extension != "jpg" && extension != "jpeg" && extension != "png") {
            return { "status": 400, "data": "File must be a jpg, jpeg or png" };
        }
        let filename = await saveFile(req.files.file);
        //we require fs to read the file as a stream
        var fs = require('fs');

        //we require form-data to send the file and other form fields
        let FormData = require('form-data');
        let formData = new FormData();

        //fs.createReadStream is needed to read the file and get the file size
        formData.append("file", fs.createReadStream(filename), { knownLength: fs.statSync(filename).size });

        //append the other form fields
        formData.append("userid", req.body.userid);
        formData.append("title", req.body.title);
        formData.append("articlenumber", req.body.articlenumber);
        formData.append("description", req.body.description);
        formData.append("count", req.body.count);

        //set headers with size of form-data
        const headers = {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        };

        return axios.post('http://localhost:3000/equipment', formData, { headers }) //Doppeltes return -> alles nach return wird nicht ausgeführt
            .then(function (response) {
                //delete the file after sending
                fs.unlinkSync(filename);
                return { "status": 200, "data": response.data };
            })
            .catch(function (error) {
                res.send(error)
            });
    }
}

//Holt einzelnes Equipment vom Backend
const getSingleEquipment = async (id) => {
    let response
    try {
        response = await axios.get('http://localhost:3000/equipment/' + id);
    }
    catch (error) {
        console.log(error);
        return { "status": 404 }
    }
    return { "status": 200, "data": response.data }
}

//Löscht einzelne ID vom Backend
const deleteEquipment = async (req) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    }
    else {
        let response = await axios.delete('http://localhost:3000/equipment/' + req.params.id);
        return response;
    }
}

const updateEquipment = async (req, res) => {
    if (!utils.auth(req)) {
        return { "status": 403, "data": "Not authorized" };
    }
    if (!req.files) {
        //Wenn kein File hochgeladen wird, dann wird nur der Body geupdated
        let response;
        try {
            await axios.put('http://localhost:3000/equipment/' + req.body.id, req.body);
        }
        catch (error) {
            console.log(error);
            return { "status": 404 }
        }
        return {
            "status": 200
        };
    }
    else {
        let filename = await saveFile(req.files.file);
        //we require fs to read the file as a stream
        console.log("Filename: " + filename);
        var fs = require('fs');

        //we require form-data to send the file and other form fields
        let FormData = require('form-data');
        let formData = new FormData();

        //fs.createReadStream is needed to read the file and get the file size
        formData.append("file", fs.createReadStream(filename), { knownLength: fs.statSync(filename).size });

        //append the other form fields
        formData.append("userid", req.body.userid);
        formData.append("title", req.body.title);
        console.log("articlenumber: " + req.body.articlenumber);
        formData.append("articlenumber", req.body.articlenumber);
        formData.append("description", req.body.description);
        formData.append("count", req.body.count);

        //set headers with size of form-data
        const headers = {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        };

        return axios.put('http://localhost:3000/equipment/' + req.body.id, formData, { headers }) //Doppeltes return -> alles nach return wird nicht ausgeführt
            .then(function (response) {
                //delete the file after sending
                fs.unlinkSync(filename);
                return { "status": 200 };
            })
            .catch(function (error) {
                res.send(error)
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