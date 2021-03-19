var _ = require('lodash');
var mongoose = require('mongoose');
var config = require('../config/config');
var stripe = require('stripe')(config.stripe_Secret_key);
var moment = require('moment');
var userService = require('../services').userService;

const paymentSuccess = async ( req, res, next ) => {

    try {

        res.render('paymentSuccess.ejs');
    } catch(ex) {

        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });
    }
}

const paymentButton = async( req, res, next ) => {
    
    try {

        res.render('paymentCheckout.ejs', {key: config.stripe_Publishable_key});
    } catch(ex) {

        return res.send({
            status: 400,
            msg: ex.toString(),
            data: ex
        });
    }
}

const charge = async( req, res, next ) => {
    // try {
        // Moreover you can take more details from user 
        // like Address, Name, etc from form 
        // console.log('req.body', req.body);
        let cust_id;
        let user_id = req.body.userId;

        let out_data = {
            customer: {},
            subscription: {},
            charges: {},
        };
        stripe.customers.create({ 
            email: req.body.stripeEmail, 
            source: req.body.stripeToken, 
            name: req.body.name, 
            address: { 
                // line1: 'TC 9/4 Old MES colony', 
                // postal_code: '143001', 
                // city: 'Amritsar', 
                // state: 'Punjab', 
                // country: 'India', 

                line1: 'testing', 
                postal_code: 'testing', 
                city: 'testing', 
                state: 'testing', 
                country: 'Australia', 
            } 
        }) 
        .then((customer) => {     

            out_data.customer = customer;
            cust_id = customer.id;

            let next_fourteen_days = moment().add(14, 'days').format('YYYY-MM-DD');
            let timeStr =   moment(next_fourteen_days).format("X");

            return stripe.subscriptions.create({
                customer: customer.id,
                items: [{plan: config.stripe_plan_id}],
                trial_end: timeStr,
            });
        }) 
        .then( async (subscription) => {
            out_data.subscription = subscription;

            // stripe.charges.create({ 
            //     amount: req.body.amount,     // Charing Rs 25 
            //     description: req.body.description, 
            //     currency: req.body.currency, 
            //     customer: cust_id
            // }); 

            let in_data = {
                payment: 'DONE'
            };
            let userUpdated = await userService.updateUser( in_data, user_id );

            res.send({
                status: 200,
                msg: 'Successfully Subscribed.',
                data: {
                    rows: out_data,
                    userPaymentStatus: userUpdated
                } 
            });
        })
        // .then((charges) => { 
        //     out_data.charges = charges;

        //     console.log('success charges', charges);
        //     // res.send("Success")  // If no error occurs 
        //     res.send({
        //         status: 200,
        //         msg: 'Payment complete',
        //         data: {
        //             rows: out_data
        //         } 
        //     });
        // })
        .catch((err) => {
            return res.send({
                    status: 400,
                    msg: (!err.toString()) ? err.toString() : err,
                    data: err
                });
        });
    // } catch (ex) {
    //     return res.send({
    //         status: 400,
    //         msg: ex.toString(),
    //         data: ex
    //     });
    // }    
}

module.exports = {
    paymentSuccess,
    paymentButton,
    charge
};