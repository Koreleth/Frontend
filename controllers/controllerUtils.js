var express = require('express');
var router = express.Router();
var axios = require('axios');

/**
 * Authentifiziert den Benutzer basierend auf der Sitzung.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Boolean} - Ob der Benutzer authentifiziert ist oder nicht.
 */
const auth = (req) => {
    console.log("==Frontend== Authentication check");

    // Prüft, ob ein Benutzer in der Sitzung existiert
    if (!req.session.user) {
        console.log("==Frontend== No user in session");
        return false;
    }

    // Prüft, ob der Benutzer ein Administrator ist
    if (isAdmin(req)) {
        return true;
    }

    // Prüft, ob der Benutzer derselbe ist wie der angeforderte Benutzer
    if (req.params.id) {
        if (isSameUser(req)) {
            return true;
        }
    }

    return false;
}

/**
 * Überprüft, ob der Benutzer derselbe ist wie der angeforderte Benutzer.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Boolean} - Ob der Benutzer derselbe ist oder nicht.
 */
const isSameUser = (req) => {
    if (req.session.user.id == req.params.id) {
        console.log("==Frontend== User is same as requested");
        return true;
    }
    return false;
}

/**
 * Überprüft, ob der Benutzer ein Administrator ist.
 * @param {Object} req - Das Anfrageobjekt.
 * @returns {Boolean} - Ob der Benutzer ein Administrator ist oder nicht.
 */
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
