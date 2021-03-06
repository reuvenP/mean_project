var express = require('express');
var router = express.Router();
var rsa = require('../modules/rsa');
var debug = require('debug')('nodejs-project:root');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires",0);
    res.render('index', { title: 'Express', publicKey: rsa.exportKey('public') });
});

router.get('/index.html', function(req, res, next) {
    res.redirect('/');
});

router.get('/login.html', function(req, res, next) {
    req.session.random = Math.floor((Math.random() * 2000000000) + 1);
    res.render("login", { random: req.session.random });
});

module.exports = router;
