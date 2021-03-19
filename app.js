var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var paymentController = require('./controllers').paymentController;

var config = require('./config/config');
var stripe = require('stripe')(config.stripe_Secret_key);

var mongoose = require('mongoose');
var db = require('./config/config').mongodbUrl;
console.log(db, 'db')
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected')).catch(err => console.log(err))

var indexRouter = require('./routes/index');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// payment
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
app.get('/charge', function( req, res, next ) {
  return res.send({
    status: 200,
    msg: 'working',
    data: []
  });
} );

app.get('/paymentSuccess', [
  paymentController.paymentSuccess
]);

app.post('/charge', upload.single('qr_code'), [
  paymentController.charge
]);

app.get('/test', async function( req, res, next ) {

  try {

    let out = {
        products_list: await stripe.products.list({}),
        plans_list: await stripe.plans.list({})
    };
    
    res.send({
        status: 200,
        msg: 'data',
        data: {
            rows: out
        } 
    });
    
  } catch(e) {
    console.log(e);
  }
});

app.post('/createProduct', async function( req, res, next ) {
  try {

    let productName = req.body.productName;
    let product = await stripe.products.create({
      name: productName,
      type: 'service',
    });
  
    console.log(product);
    res.send({
      status: 200,
      msg: 'data',
      data: {
        rows: product
      }
    });
  } catch (ex) {
    return res.send({
      status: 400,
      msg: ex.toString(),
      data: ex
    });
  }
});

app.post('/createPlan', async function( req, res, next ) {
  try {
    
    let productId = req.body.productId;
    let plan = await stripe.plans.create({
      product: productId,
      nickname: 'Monthly Subscription Plan',
      currency: "usd",
      interval: 'month',
      amount: '200',
    });
  
    console.log(plan);
    res.send({
      status: 200,
      msg: 'data',
      data: {
        rows: plan
      }
    });
  } catch (ex) {
    return res.send({
      status: 400,
      msg: ex.toString(),
      data: ex
    });
  }
});

app.use('/api1', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
