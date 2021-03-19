var _ = require('lodash');
var express = require('express');
var router = express.Router();
var visiorController = require('../controllers').visiorController;
var authController = require('../controllers').authController;
var restaurantService = require('../services').restaurantService;
var visitorService = require('../services').visitorService;
var config = require('../config/config');

/* GET users listing. */
router.get('/todaysVisitors', [
    visiorController.findTodaysVisitors
]);

router.get('/count/restaurant/:restaurant_id', [
    authController.verifyToken,
    authController.verifyUser,
    visiorController.getVisitorCountByRestaurantId
]);

router.get('/restaurant/:restaurant_id', [
    authController.verifyToken,
    authController.verifyUser,
    visiorController.findAllVisitorByRestaurant
]);

router.patch('/:id', [
    visiorController.updateVisitor
]);

router.delete('/:id', [
    visiorController.deleteVisitor
]);

router.get('/:id', [
    visiorController.findVisitor
]);

router.post('/', [
    visiorController.insertVisitor
]);

router.get('/', [
    visiorController.findAllVisitor
]);

router.get('/load/:restaurant_id/:visitor_id?', async function(req, res) {

    try {

        let flag = false;
        let result_visitor = {
            "status": "",
            "_id": "",
            "name": "",
            "contact": "",
            "restaurant_id": "",
            "table_number": "0",
            "create_date": "",
            "__v": 0
        };
        let restaurant_id = req.params.restaurant_id;
        let visitor_id = req.params.visitor_id;
        let result_restaurant = await restaurantService.findRestaurantById( restaurant_id );
        if( _.isEmpty( result_restaurant ) ) {
            return res.send({
                status: 200,
                msg: 'Restaurant not found.',
                data: {}
            });
        } else {

            if( visitor_id !== undefined ) {
                flag = true;

                result_visitor = await visitorService.findVisitorById( visitor_id );
                if( _.isEmpty( result_visitor ) ) {
                    return res.send({
                        status: 400,
                        msg: 'Visitor not found.',
                        data: {}
                    });
                } else {

                }
            }

            res.render('insertVisitor.ejs', {
                status: 200,
                msg: 'Restaurant found.',
                data: {
                    isVisitor: flag,
                    restaurant_id: restaurant_id,
                    baseUrl: config.baseUrl,
                    rows: {
                        restaurant: result_restaurant,
                        visitor: result_visitor
                    }
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
});

router.get('/load/confirm/:restaurant_id/:visitor_id', async function(req, res) {
    try {

        let restaurant_id = req.params.restaurant_id;
        let visitor_id = req.params.visitor_id;

        let result_restaurant = await restaurantService.findRestaurantById( restaurant_id );
        if( _.isEmpty( result_restaurant ) ) {
            return res.send({
                status: 400,
                msg: 'Restaurant not found.',
                data: {}
            });
        } else {  
            
            let result_visitor = await visitorService.findVisitorById( visitor_id );
            if( _.isEmpty( result_visitor ) ) {
                return res.send({
                    status: 400,
                    msg: 'Visitor not found.',
                    data: {}
                });
            } else {

                let minutesAgo = 0;
                let today = new Date();
                var create_date = new Date( result_visitor.create_date );
                var diffMs = (today - create_date); // milliseconds between dates
                minutesAgo = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                if( minutesAgo < 1 ) {
                    minutesAgo = 'a '
                }
                res.render('confirmVisitor.ejs', {
                    data: {
                        rows: {
                            restaurant_id: restaurant_id,
                            visitor_id: visitor_id,
                            baseUrl: config.baseUrl,
                            restaurant: result_restaurant,
                            visitor: result_visitor,
                            minutesAgo: minutesAgo
                        }
                    }
                });
            }
        }
    } catch(ex) {

        return res.send({
            status: 400,
            msg: 'Exception occur',
            dataStr: ex.toString(),
            data: ex
        });
    }
});

module.exports = router;