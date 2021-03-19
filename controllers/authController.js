var _ = require('lodash');
var mongoose = require('mongoose');
var authService = require('../services').authService;
var userService = require('../services').userService;
var restaurantService = require('../services').restaurantService;
var Validator = require('validatorjs');
var config = require('../config/config');
const jwt = require('jsonwebtoken');
var md5 = require('md5');

const signUp = async ( req, res, next ) => {

    try {

        let body = req.body;
        let rules = {
            email: 'required|email',
            password: 'required',
            // contact: 'required',
            first_name: 'required'
        };
        
        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors.all();
            
        } else if( await userService.isEmailExists( body.email ) ) {
            throw ['Email already taken.'];
        
        // } else if( await userService.isContactExists( body.contact ) ) {
        //     throw ['Contact already taken.'];

        } else {            

            let in_data = {};

            in_data.email = req.body.email;
            in_data.password = req.body.password;
            in_data.first_name = req.body.first_name;
            in_data.last_name = '';
            in_data.payment = 'HOLD';

            if( _.has( body, 'last_name' ) ) {
                in_data.last_name = req.body.last_name
            }
            in_data.password = md5(in_data.password);
            let userData = await userService.insertUser( in_data );
            let token = await authService.generateJwtToken( userData );
            return res.send({
                status: 200,
                msg: 'Signup successfully.',
                data: {
                    rows: userData,
                    token: token
                }
            });
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });
    }
}

const signIn = async ( req, res, next ) => {

    try {
        let body = req.body;
        let rules = {
            email: 'required|email',
            password: 'required'
        };

        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors.all();
        } else {
            let email = req.body.email;
            let pwd = md5( req.body.password );
            let userData = await authService.signIn( email, pwd );
            if( _.isEmpty( userData ) ) {
                throw ['Email not found.'];

            } else if( pwd != userData.password ) {
                throw ['Password not match.'];
            
            } else {
                let result = await userService.verifyUserById( userData._id );
                if( result == true ) {
                    let outUerData = {
                        _id: userData._id,
                        email: userData.email,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        status: userData.status,
                    };
                    let token = await authService.generateJwtToken( { user_id: userData._id } );
                    return res.send({
                        status: 200,
                        msg: 'User signin successfully',
                        data: {
                            user: outUerData,
                            token: token
                        }
                    });        
                } else {
                    throw result;
                }
            }
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });
    }
}

const verifyToken = async (req, res, next) => {
    try {

        //Request header with authorization key
        const bearerHeader = req.headers['authorization'];
        
        //Check if there is  a header
        if(typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            
            //Get Token arrray by spliting
            const bearerToken = bearer[1];
            req.token = bearerToken;

            let out_jwt = await jwt.verify( req.token, config.jwtSecret);
            req.authData = {
                user_id: out_jwt.userData.user_id
            };
            next();
        }else{
            throw 'Header is not defined.';

        }
    } catch( ex ) {
        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });      
    }
}

const verifyUser = async(req, res, next) => {

    try {
        let userId = req.authData.user_id;
        if( await userService.verifyUserById( userId ) ) {
            //call next middleware
            next();

        } else {
            throw ['Unable to verify user.']
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

const signOut = async ( req, res, next ) => {}

module.exports = {
    signUp,
    signIn,
    verifyToken,
    verifyUser,
    signOut
};