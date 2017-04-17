var express = require('express');
const api = require('./lib/apiClient');

var router = express.Router();
const a0 = require('./lib/auth0Client');


/* GET home page. */
router.get('/email', function(req, res, next) {
  res.render('invite-email', { title: 'invite by email' });
});

router.post('/email', function(req, res, next) {
  let email = req.body.email;
  if (email) {
    api.createInvite({
      type: "email",
      email: email
    });
  }

});



module.exports = router;
