var _ = require('lodash');
var mongoose = require('mongoose');
var visitorService = require('../services').visitorService;
var restaurantService = require('../services').restaurantService;
var Validator = require('validatorjs');

const insertVisitor = async ( req, res, next ) => {

    try {

        let body = req.body;
        let rules = {
            restaurant_id: 'required',
            contact: 'required',
            name: 'required'
        };

        if( _.has( body, 'table_number' ) ) {
            rules.table_number = 'numeric|min:0';
        }
        
        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors;

        } else {            

            let in_data = req.body;
            let result = await visitorService.insertVisitor( in_data );
            return res.send({
                status: 200,
                msg: 'Visitor inserted successfully.',
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

const findAllVisitor = async ( req, res, next ) => {
    try {

        let result = await visitorService.findAllVisitor();
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Visitors not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Visitors found',
                data: {
                    rows: result,
                    cnt: await visitorService.countAllVisitor()
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

const updateVisitor = async ( req, res, next ) => {

    try {
        let body = req.body;
        let id = req.params.id;
        let rules = {};
        
        if( _.has( body, 'restaurant_id' ) ) {
            rules.restaurant_id = 'required';
        }

        if( _.has( body, 'contact' ) ) {
            rules.contact = 'required';
        }

        if( _.has( body, 'name' ) ) {
            rules.name = 'required';
        }

        let validation = new Validator( body, rules );
        if( validation.fails() ) {
            throw validation.errors.all();

        } else {
            let visitor = await visitorService.findVisitorById( id );
            if( _.isEmpty( visitor ) ) {
                throw ['Vistor  not found.'];

            } else {
                
                visitor = body;
                let result = await visitorService.updateVisitor( visitor, id );
                return res.send({
                    status: 200,
                    msg: 'Visitor updated successfully.',
                    data: result
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

const deleteVisitor = async ( req, res, next ) => {

    try {
        let id = req.params.id;
        let visitor = await visitorService.findVisitorById( id );
        if( _.isEmpty( visitor ) ) {
            return res.send({
                status: 200,
                msg: 'Vistor not found.',
                data: []
            });
        } else {
            
            visitor.status = 'DELETED';
            let result = await visitorService.updateVisitor( visitor, id );
            return res.send({
                status: 200,
                msg: 'Visitor deleted successfully.',
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

const findVisitor = async ( req, res, next ) => {

    try {

        let id = req.params.id;
        let result = await visitorService.findVisitorById( id );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Visitor not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Visitor found',
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

const findTodaysVisitors = async ( req, res, next ) => {
    try {

        let result = await visitorService.findTodaysVisitors();
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Visitors not found.',
                data: []
            });
        } else {            
            return res.send({
                status: 200,
                msg: 'Visitors found',
                data: {
                    rows: result,
                    cnt: await visitorService.countTodaysVisitors()
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

const findAllVisitorByRestaurant = async( req, res, next ) => {
    try {
        let in_restaurant_id = req.params.restaurant_id;
        let in_frm = req.query.frm;
        let in_to = req.query.to;

        let restaurant_id = mongoose.Types.ObjectId( in_restaurant_id );
        let frmDate = in_frm;
        let toDate = in_to;

        let result = await visitorService.findAllVisitorByRestaurant( restaurant_id, frmDate, toDate );
        if( _.isEmpty( result ) ) {
            return res.send({
                status: 200,
                msg: 'Visitors not found.',
                data: []
            });
        } else {
            return res.send({
                status: 200,
                msg: 'Visitors found',
                data: {
                    rows: result,
                    cnt: await visitorService.countAllVisitorByRestaurant( restaurant_id ),
                    restaurant_detail: await restaurantService.findRestaurantById( restaurant_id )
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

const getVisitorCountByRestaurantId = async( req, res, next ) => {
    try {
        
        let in_restaurant_id = req.params.restaurant_id;
        let restaurant_id = mongoose.Types.ObjectId( in_restaurant_id );

        let result = await visitorService.getVisitorCountByRestaurantId( restaurant_id );
        console.log('result getVisitorCountByRestaurantId', result);
        if( parseInt( result ) < 1 ) {
            return res.send({
                status: 200,
                msg: 'Visitors not found.',
                data: []
            });
        } else {
            return res.send({
                status: 200,
                msg: 'Visitors found',
                data: {
                    rows: {},
                    cnt: result
                }
            });
        }
    } catch (ex) {
        
        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
}

module.exports = {
    insertVisitor,
    updateVisitor,
    deleteVisitor,
    findVisitor,
    findAllVisitor,
    findTodaysVisitors,
    findAllVisitorByRestaurant,
    getVisitorCountByRestaurantId
};