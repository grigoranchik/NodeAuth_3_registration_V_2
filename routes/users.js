var express = require('express');
var router = express.Router();

/* GET users listing. */
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now());
    next();
});

router.get('/fractale', function(req, res, next) {
    res.send('fractale');
});

router.get('/mango', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
