var _ = require('lodash');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config');

const generateJwtToken = async ( userData ) => {
    try {
        let token = await jwt.sign({userData}, config.jwtSecret, { expiresIn: '365d' });
        return 'bearer '+ token;
        
    } catch(ex) {
        return ex;
    }
}

const signIn = async ( email, password ) => {
    try {
        let result = await User.findOne( { email: email } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const signOut = async () => {
    try {
        let result = await User.find( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

module.exports = {
    generateJwtToken,
    signIn,
    signOut
};