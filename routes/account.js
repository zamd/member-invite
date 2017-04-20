var express = require('express');


var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('account', { title: 'Account management' });
});


router.get('/sim', function(req, res, next) {
  res.render('sim', { title: 'SIM management' });
});

router.get('/address', function(req, res, next) {
  res.render('address', { title: 'Address management' });
});

module.exports = router;