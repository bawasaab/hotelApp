var mongoose = require('mongoose');
var QRCode = require('qrcode');
var Restaurant = require('../models/restaurant');
var config = require('../config/config');

const countAllRestaurant = async () => {
    try {
        let result = await Restaurant.countDocuments( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findAllRestaurant = async () => {
    try {
        let result = await Restaurant.find( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findRestaurantById = async ( in_id ) => {
    try {
        let id = mongoose.Types.ObjectId( in_id );
        let result = await Restaurant.findOne( { _id: in_id, status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const insertRestaurant = async ( in_data, in_userId ) => {
    try {
        in_data.created_by = mongoose.Types.ObjectId( in_userId );
        let usr = new Restaurant(in_data);
        let result = await usr.save();
        return result;
        
    } catch(ex) {
        return ex;
    }
}

const updateRestaurant = async ( in_data, in_id ) => {
    try {
        let id = mongoose.Types.ObjectId( in_id );
        in_data.modify_date = new Date();

        let result = await Restaurant.updateOne({ _id: id }, {
            $set: in_data
        });
        return result;
    } catch(ex) {
        return ex;
    }
}

const generateQrCode = async ( in_id ) => {
    try {
        let restaurantId = config.QrCodeLink + in_id;
        return await QRCode.toDataURL( restaurantId, { errorCorrectionLevel: 'H' });
    } catch (ex) {
        return ex;
    }
}

const findAllRestaurantByUserId = async ( in_userId ) => {
    try {
        let userId = mongoose.Types.ObjectId( in_userId );
        let result = await Restaurant.find( { created_by: userId, status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

module.exports = {
    countAllRestaurant,
    findAllRestaurant,
    findRestaurantById,
    insertRestaurant,
    updateRestaurant,
    generateQrCode,
    findAllRestaurantByUserId
};