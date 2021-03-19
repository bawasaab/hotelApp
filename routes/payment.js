var express = require('express');
var router = express.Router();
var config = require('../config/config');
var paymentController = require('../controllers').paymentController;

/* GET users listing. */

router.get('/', function(req,res,next) {
    return res.send({
        status: 200,
        msg: 'working',
        data: []
    });
});

router.get('/paymentSuccess', [
    paymentController.paymentSuccess
]);

router.get('/paymentButton', [
    paymentController.paymentButton
]);

// router.post('/charge', [
//     paymentController.charge
// ]);

module.exports = router;