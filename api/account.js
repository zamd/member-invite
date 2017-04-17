var express = require('express');
var router = express.Router();


const dummyAccount = {
    accountTitle: "Zulfiqar Ahmed",
    registeredNumber: "07967150579",
    address: "5 Birchley Park Avenue, Oldbury"
}

router.get('/', function(req, res, next) {
  res.json(dummyAccount);
});

//change address
router.post('/address', function(req, res, next) {
  res.json(dummyAccount);
});

//swap sim
router.post('/sim', function(req, res, next) {
  res.json(dummyAccount);
});

module.exports = router;
