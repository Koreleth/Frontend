var express = require('express');
var router = express.Router();
var axios = require('axios');

async function saveFile(file) {
    //move the file to the public/uploads folder
    await file.mv('public/uploads/' + file.name);
    //get the complete path of the file
    let filename = process.cwd() + '/public/uploads/' + file.name;
    return filename;
}

//need to fix: 
const getEquipment = async () => {
    return axios.get('http://localhost:3000/equipment')
        .then(response => {
        return { "status": 200, "data": response.data };;
    });
};

const createEquipment = async (req) => { 

        if (!req.files) {
            axios.post('http://localhost:3000/equipment/', req.body)
                .then(response => {
                    return { "status": 200, "data": response };
                });
        } else {
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
    
           return axios.post('http://localhost:3000/equipment', formData, { headers })
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


const getSingleEquipment = async(id) => {
    return axios.get('http://localhost:3000/equipment/' + id)
            .then(response => {
                console.log(response);
                return {"status": 200, "data": response.data};
            });
    }

    

module.exports = {
    getEquipment,
    createEquipment,
    getSingleEquipment
}