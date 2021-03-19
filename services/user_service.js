var _ = require('lodash');
var mongoose = require('mongoose');
var User = require('../models/user');

const countAllUser = async () => {
    try {
        let result = await User.countDocuments( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findAllUsers = async () => {
    try {
        let result = await User.find( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findUserById = async ( in_id ) => {
    try {
        let id = mongoose.Types.ObjectId( in_id );
        let result = await User.findOne( { _id: in_id, status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const verifyUserById = async ( in_id ) => {
    try {
        
        let id = mongoose.Types.ObjectId( in_id );
        let user = await User.findOne( { _id: id } );
        if( _.isEmpty( user ) ) {
            throw ['User not found.'];

        } else if( user.status == 'DELETED' ) {
            throw ['Account has been deleted.'];

        } else if( user.status == 'CLOSE' ) {
            throw ['Account has been closed.'];
        
        } else if( user.payment == 'HOLD' ) {
            throw ['Your subscription is pending.'];

        } else {
            return true;   
        }
    } catch(ex) {
        return ex;
    }
}

const insertUser = async ( in_data ) => {
    try {
        let usr = new User(in_data);
        let result = await usr.save();
        return result;
        
    } catch(ex) {
        return ex;
    }
}

const updateUser = async ( in_data, in_id ) => {
    try {

        let id = mongoose.Types.ObjectId( in_id );
        in_data.modify_date = new Date();

        let result = await User.updateOne({ _id: id }, {
            $set: in_data
        });
        return result;
    } catch(ex) {
        return ex;
    }
}

const isEmailExists = async( email, in_id ) => {

    try {
        let id;
        if( in_id ) {
            id = mongoose.Types.ObjectId( in_id );
            let result = await User.findOne( { email: email, _id: { $ne: id } } );
            return _.isEmpty( result ) ? false : true;

        } else {            
            let result = await User.findOne( { email: email } );
            return _.isEmpty( result ) ? false : true;
        }
    } catch(ex) {
        return ex;
    }
}

const isContactExists = async( contact, in_id ) => {

    try {
        let id;
        if( in_id ) {
            id = mongoose.Types.ObjectId( in_id );
            let result = await User.findOne( { contact: contact, _id: { $ne: id } } );
            return _.isEmpty( result ) ? false : true;

        } else {            
            let result = await User.findOne( { contact: contact } );
            return _.isEmpty( result ) ? false : true;
        }
    } catch(ex) {
        return ex;
    }
}

module.exports = {
    countAllUser,
    findAllUsers,
    findUserById,
    verifyUserById,
    insertUser,
    updateUser,
    isEmailExists,
    isContactExists
};