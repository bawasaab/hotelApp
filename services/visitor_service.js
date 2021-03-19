var _ = require('lodash');
var mongoose = require('mongoose');
var moment = require('moment');
var Visitor = require('../models/visitor');

const countAllVisitor = async () => {
    try {
        let result = await Visitor.countDocuments( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findAllVisitor = async () => {
    try {
        let result = await Visitor.find( { status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const findVisitorById = async ( in_id ) => {
    try {
        let id = mongoose.Types.ObjectId( in_id );
        let result = await Visitor.findOne( { _id: in_id, status: { $ne: 'DELETED' } } );
        return result;

    } catch(ex) {
        return ex;
    }
}

const insertVisitor = async ( in_data ) => {
    try {
        let usr = new Visitor(in_data);
        let result = await usr.save();
        return result;
        
    } catch(ex) {
        return ex;
    }
}

const updateVisitor = async ( in_data, in_id ) => {
    try {

        let id = mongoose.Types.ObjectId( in_id );
        in_data.modify_date = new Date();

        let result = await Visitor.updateOne({ _id: id }, {
            $set: in_data
        });
        return result;
    } catch(ex) {
        return ex;
    }
}

const getTodayDate = async() => {
    
    let dated = new Date();
    let day = dated.getDate();
    let month = dated.getMonth()+1;
    let year = dated.getFullYear();

    if( day < 10 ) {
        day = '0'+ day;
    }

    if( month < 10 ) {
        month = '0'+ month;
    }

    return year +'-'+ month +'-'+ day;
}

const getTomorowDate = async() => {
    
    let dated = new Date();
    let day = dated.getDate() + 1;
    let month = dated.getMonth()+1;
    let year = dated.getFullYear();

    if( day < 10 ) {
        day = '0'+ day;
    }

    if( month < 10 ) {
        month = '0'+ month;
    }

    return year +'-'+ month +'-'+ day;
}

const countTodaysVisitors = async () => {
    try {      

        let result = await Visitor.countDocuments({ 
                $and: [{
                    create_date: {
                        // $gte: new Date( await getTodayDate() )
                        $gte: await getTodayDate()
                    },
                    // create_date: {
                    //     // $lt: new Date( await getTomorowDate() )
                    //     $lte: await getTomorowDate()
                    // },
                    status: { 
                        $ne: 'DELETED'                     
                    }
                }]
            });
        return result;

    } catch(ex) {
        return ex;
    }
}

const findTodaysVisitors = async () => {
    try {
        let result = await Visitor.find({
            $and: [{
                create_date: {
                    // $gte: new Date( await getTodayDate() )
                    $gte: await getTodayDate()
                },
                // create_date: {
                //     // $lt: new Date( await getTomorowDate() )
                //     $lte: await getTomorowDate()
                // },
                status: { 
                    $ne: 'DELETED'                     
                }
            }]
        });
        return result;

    } catch(ex) {
        return ex;
    }
}

const findAllVisitorByRestaurant = async ( restaurant_id, in_startDate, in_endDate ) => {
    try {

        if( in_startDate !== undefined && in_endDate !== undefined ) {

            let startDate = moment(in_startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
            let endDate = moment(in_endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
            let result = await Visitor.find({
                $and: [{
                    restaurant_id: restaurant_id,
                    status: { 
                        $ne: 'DELETED'
                    },
                    create_date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }]
            });
            return result;
        } else {

            let result = await Visitor.find({
                $and: [{
                    restaurant_id: restaurant_id,
                    status: { 
                        $ne: 'DELETED'
                    }
                }]
            });
            return result;
        }

    } catch(ex) {
        return ex;
    }
}

const countAllVisitorByRestaurant = async ( restaurant_id ) => {
    try {
        let result = await Visitor.countDocuments({
            $and: [{
                restaurant_id: restaurant_id,
                status: { 
                    $ne: 'DELETED'                     
                }
            }]
        });
        return result;

    } catch(ex) {
        return ex;
    }
}

const getVisitorCountByRestaurantId = async ( restaurant_id ) => {
    try {
        let result = await Visitor.countDocuments({
            $and: [{
                restaurant_id: restaurant_id,
                status: { 
                    $ne: 'DELETED'                     
                }
            }]
        });
        return result;

    } catch(ex) {
        return ex;
    }
}

module.exports = {
    countAllVisitor,
    findAllVisitor,
    findVisitorById,
    insertVisitor,
    updateVisitor,
    findTodaysVisitors,
    countTodaysVisitors,
    findAllVisitorByRestaurant,
    countAllVisitorByRestaurant,
    getVisitorCountByRestaurantId
};