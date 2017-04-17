var express = require('express');
const api = require('../lib/apiClient');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('link', { title: 'account linking' });
});

router.get('/email', function(req, res, next) {
  res.render('link-email', { title: 'link by email' });
});

router.post('/email', function(req, res, next) {
  let invite = req.body;

  if (invite.email) {
    api.createInvite(invite).then(result=>res.redirect(`summary?invite=${result.inviteCode}`))
    .catch(err=>{
      console.log(err);
      res.redirect('email');
    });
  }
  else
  {
    res.redirect('email');
  }
});

router.get('/summary', function(req, res, next) {
  let inviteCode = req.query.invite;
  if (inviteCode) {
    let invite = {link: `http://localhost:3000/invite?token=${inviteCode}`};
    //get invite;;;
    res.render("link-summmary", {title: "link summary", invite: invite})
  }
  else res.redirect('email');
});


module.exports = router;