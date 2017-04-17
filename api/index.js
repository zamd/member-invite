var express = require('express');
var router = express.Router();


router.use('/invite',require('./invite'));
router.use('/account',require('./account'))


module.exports = router;
