var express = require('express');
const api = require('../lib/apiClient');
const getDb  = require('mongo-getdb');
const ObjectId = require('mongodb').ObjectID;

var router = express.Router();

function validateInvite(invite,user){

  //TODO: validation...
  return true;
}

router.get('/', function(req, res, next) {
  let token = req.query.token; 
  if (token) {
    let inviteId = ObjectId(token);
    getDb(db=> {
      db.collection('invites').findOne({_id: inviteId}, (err,invite)=> {
        let valid = validateInvite(invite,req.user);
        if (valid) {
          db.collection('invites').updateOne({_id: inviteId},{$set: {accepted: true}}, (err,result)=>{
            db.collection('authorized_scopes').insertOne({
              userId: req.user.id,
              scopes: invite.permission
            }, (err,result)=>{

            });
            return res.redirect('/dashboard'); 
          });
        }
      });
    });
  }
  else res.json('invite token missing....');
});

module.exports = router;