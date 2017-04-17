var express = require('express');
var router = express.Router();
const getDb  = require('mongo-getdb');

router.post('/', function(req, res, next) {
  let newInvite = req.body;
  newInvite.accepted = false;

  getDb(function(db){
    db.collection('invites').insertOne(newInvite, (err,result)=>{
      res.json({inviteCode: result.insertedId});
    });
  });
});



module.exports = router;
