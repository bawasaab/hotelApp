var express = require('express');
var router = express.Router();
var auth = require('./auth');
var users = require('./users');
var payment = require('./payment');
var restaurants = require('./restaurants');
var visitor = require('./visitor');
var authController = require( '../controllers' ).authController;
var restaurantController = require( '../controllers' ).restaurantController;
var paymentController = require('../controllers').paymentController;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/payment', payment);
router.use('/auth', auth);
router.use('/visitors', visitor);

router.get( '/downloadQrCode/:id', [
  restaurantController.downloadQrCode
]);


/* middleware for token verification begins here */
router.use([
  authController.verifyToken,
  authController.verifyUser
]);
// router.use();
/* middleware for token verification ends here */

router.use('/users', users);
router.use('/restaurants', restaurants);

module.exports = router;
