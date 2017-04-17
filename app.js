var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

const session = require('express-session');
const passport = require('passport');


const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const Auth0Strategy = require('passport-auth0').Strategy;



passport.use(new Auth0Strategy({
    domain: "telstra-cse.auth0.com",
    clientID:"jZScQT8gCihqBGEqvSUGaTrMEZBFVGxm",
    clientSecret: "C711Wb2uNWmyg7bLa9yohT8lp9fymJ7WlFstKVZJ2yJ0UiPEkevOpP8U-lYpKhPw",
    callbackURL: "http://localhost:3000/login/callback" 
},function(accessToken,refresToken, extraParams, profile, done){
  done(null,profile);
}));

passport.serializeUser((user,done)=>{
  done(null, user);
});

passport.deserializeUser((user,done)=>{
  done(null,user);
});


var app = express();
app.use(session({resave:true, saveUninitialized:true, secret:"32322"}));

app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api',require('./api'));

app.use('/login', passport.authenticate('auth0', { failureRedirect: '/login', successRedirect: "/" }));
app.use('/invite', require('./routes/invite'));
//app.use('/', ensureLoggedIn(), index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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