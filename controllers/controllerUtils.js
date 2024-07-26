var express = require('express');
var router = express.Router();
var axios = require('axios');

const auth = (req) => {
    console.log("==Frontend== Authetnication check");
    if (!req.session.user) {
        console.log("==Frontend== No user in session");
        return false;
    }
    if (isAdmin(req)) {
        return true;
    }
    if (req.params.id) {
        if (isSameUser(req)) {
            return true;
        }
    }
    return false;
}

const isSameUser = (req) => {
    if (req.session.user.id == req.params.id) {
        console.log("==Frontend== User is same as requested");
        return true;
    }
    return false;
}

const isAdmin = (req) => {
    if (!req.session.user) {
        console.log("==Frontend== No user in session");
        return false;
    }
    if (req.session.user.role == "Administrator") {
        console.log("==Frontend== User is Admin");
        return true;
    }
    return false;
};

module.exports = {
    auth,
    isSameUser,
    isAdmin
}