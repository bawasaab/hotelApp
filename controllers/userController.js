var _ = require('lodash');
var mongoose = require('mongoose');
var userService = require('../services').userService;
var Validator = require('validatorjs');
var md5 = require('md5');

const insertUser = async ( req, res, next ) => {

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
        
        } else if( await userService.isContactExists( body.contact ) ) {
            throw ['Contact already taken.'];

        } else {            

            let in_data = req.body;
            in_data.password = md5( in_data.password );
            let result = await userService.insertUser( in_data );
            return res.send({
                status: 200,
                msg: 'User inserted successfully.',
                data: {
                    rows: result
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

const updateUser = async ( req, res, next ) => {

    try {
        let body = req.body;
        let id = req.params.id;
        let rules = {};
        
        if( _.has( body, 'first_name' ) ) {
            rules.first_name = 'required';
        }

        if( _.has( body, 'email' ) ) {
            rules.email = 'required|email';
        }

        if( _.has( body, 'password' ) ) {
            rules.password = 'required';
        }

        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors.all();

        } else {
            let user = await userService.findUserById( id );
            if( _.isEmpty( user ) ) {
                throw ['User  not found.'];
                
            } else if( out = await userService.isEmailExists( body.email, id ) ) {
                throw ['Email already taken.'];
    
            // } else if( await userService.isContactExists( body.contact, id ) ) {
            //     throw ['Contact already taken.'];

            } else {
                
                user = body;
                if( _.has( body, 'password' ) ) {
                    user.password = md5(user.password);
                }
                let result = await userService.updateUser( user, id );
                return res.send({
                    status: 200,
                    msg: 'User updated successfully.',
                    data: {
                        rows: result
                    }
                });
            }   
        }        
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            msgStr: ex.toString(),
            data: ex
        });
    }
}

const deleteUser = async ( req, res, next ) => {

    try {
        let id = req.params.id;
        let user = await userService.findUserById( id );
        if( _.isEmpty( user ) ) {
            return res.send({
                status: 200,
                msg: 'User not found.',
                data: []
            });
        } else {
            
            user.status = 'DELETED';
            let result = await userService.updateUser( user, id );
            return res.send({
                status: 200,
                msg: 'User deleted successfully.',
                data: {
                    rows: result
                }
            });
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

const findUser = async ( req, res, next ) => {

    try {

        let id = req.params.id;
        let result = await userService.findUserById( id );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'User not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'User found',
                data: {
                    rows: result
                }
            });
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

const findAllUser = async ( req, res, next ) => {
    try {

        let result = await userService.findAllUsers();
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Users not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Users found',
                data: {
                    rows: result,
                    cnt: await userService.countAllUser()
                }
            });
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

const changeProfilePic = async ( req, res, next ) => {
    try {
        let id = req.params.id;
        let user = await userService.findUserById( id );
        if( _.isEmpty( user ) ) {
            return res.send({
                status: 200,
                msg: 'User not found.',
                data: []
            });
        } else {
            
            user.profile_pic = req.body.profile_pic;
            let result = await userService.updateUser( user, id );
            return res.send({
                status: 200,
                msg: 'User profile pic changed successfully.',
                data: {
                    rows: result
                }
            });
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

module.exports = {
    insertUser,
    updateUser,
    deleteUser,
    findUser,
    findAllUser,
    changeProfilePic
};