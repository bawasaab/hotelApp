var express = require('express');
var router = express.Router();
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

router.post('/signUp', upload.single('profile_pic'), [
    authController.signUp
]);

router.post('/signIn', upload.single('profile_pic'), [
    authController.signIn
]);

router.post('/signOut', [
    authController.signOut
]);

router.get('/load/signUp', function(req, res) {
    res.render('signup.ejs');
});

router.get('/load/signin', function(req, res) {
    res.render('signin.ejs');
});

module.exports = router;