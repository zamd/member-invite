const express = require('express'),
      _ = require('dotenv').config(),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      getDb  = require('mongo-getdb'),
      a0Client = require('./lib/auth0Client'),
      index = require('./routes/index'),
      session = require('express-session'),
      passport = require('passport'),
      ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
      Auth0Strategy = require('passport-auth0').Strategy,
      app = express();

getDb.init(process.env.DB);

passport.use(new Auth0Strategy({
    domain: process.env.Domain,
    clientID:process.env.ClientID,
    clientSecret: process.env.ClientSecret,
    callbackURL: process.env.CallbackURL 
},(accessToken,refresToken, extraParams, profile, done) => done(null,profile)));

passport.serializeUser((user,done)=>done(null, user));

passport.deserializeUser((user,done)=>done(null,user));

app.use(session({resave:true, saveUninitialized:true, secret:"32322"}));
app.use(passport.initialize());
app.use(passport.session());

function ensureInvite(req,res,next) {
  if (req.user && req.query.token) {
    next();
  } 
  else {
    let token = req.query.token;
    let url = a0Client.buildAuthorizationCodeUrl(token);
    res.redirect(url);
  }
}

function processInvite(req,res,next){
  if (req.user && req.query.state) {
    res.redirect(`/invite?token=${req.query.state}`);
  }
  else {
    res.redirect('/');
  }
}

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
app.use('/login', passport.authenticate('auth0', { failureRedirect: '/login' }), processInvite);
app.use('/logout', ensureLoggedIn(), (req,res,next)=>{req.logOut(); res.end('logged out!');});
app.use('/link', require('./routes/link'));

app.use('/invite', ensureInvite, require('./routes/invite'));
app.use('/dashboard', ensureLoggedIn(), require('./routes/dashboard'));
app.use('/account', ensureLoggedIn(), require('./routes/account'));
app.use('/', ensureLoggedIn(), index);

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
