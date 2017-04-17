var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next) {
  console.log(req.body)
  res.json({created: true});
});

module.exports = router;
