var express = require('express');
var router = express.Router();
var restaurantController = require('../controllers').restaurantController;
var authController = require('../controllers').authController;

var path = require('path');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/qr_codes/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/qr_codes/')
    },
    filename: function (req, file, cb) {
      let fileName = Date.now() + path.extname(file.originalname);
      req.body.qr_code = fileName;
      cb(null, fileName );
    }
});
   
var upload = multer({ storage: storage });

/* GET restaurants listing. */
router.post('/changeQr/:id', upload.single('qr_code'), [
  restaurantController.changeQrCode
]);

router.patch('/:id', [
  restaurantController.updateRestaurant
]);

router.delete('/:id', [
  restaurantController.deleteRestaurant
]);

router.get('/:id', [
  restaurantController.findRestaurant
]);

router.post('/', upload.single('qr_code'), [
  restaurantController.insertRestaurant
]);

router.get('/', [
  // restaurantController.findAllRestaurant
  restaurantController.findAllRestaurantByUserId
]);

router.post( '/generateQrCode', upload.single('qr_code'), [
  restaurantController.generateQrCode
] );

module.exports = router;