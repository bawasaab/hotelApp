var express = require('express');
var router = express.Router();
var usersController = require('../controllers').userController;
var authController = require('../controllers').authController;

var path = require('path');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      let fileName = 'usr-' + Date.now() + path.extname(file.originalname);
      req.body.profile_pic = fileName;
      cb(null, fileName );
    }
});
   
var upload = multer({ storage: storage });

/* GET users listing. */
router.post('/changePic/:id', upload.single('profile_pic'), [
  usersController.changeProfilePic
]);

router.patch('/:id', [
  usersController.updateUser
]);

router.delete('/:id', [
  usersController.deleteUser
]);

router.get('/:id', [
  usersController.findUser
]);

router.post('/', upload.single('profile_pic'), [
  usersController.insertUser
]);

router.get('/', [
  usersController.findAllUser
]);

module.exports = router;