var express = require('express');
var router = express.Router();
var axios = require('axios');

const auth = (req) => {
    if (req.session.user.role == "Administrator") {
        return true;
    }
    if (req.params.id) {
        if (req.session.user.id == req.params.id) {
            return true;
        }
    }
    return false;
}

const isSameUser = (req) => {
    if (req.session.user.id == req.params.id) {
        return true;
    }
    return false;
}

module.exports = {
    auth,
    isSameUser
}