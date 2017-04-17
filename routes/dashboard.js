var express = require('express');
var router = express.Router();
const getDb  = require('mongo-getdb');
const ObjectId = require('mongodb').ObjectID;



router.get('/', function(req, res, next) {
  getDb(db=>{
    db.collection('authorized_scopes').findOne({userId: req.user.id}, (err,record)=>{
      scopes = record.scopes || {};
      res.render('dashboard', { title: 'Selfcare Dashboard', scopes: scopes});
    });
  });
  
});


module.exports = router;