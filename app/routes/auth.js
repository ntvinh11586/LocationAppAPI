'use strict';
const h = require('../helpers');
const passport = require('passport');
const express = require("express");
const router = express.Router();

// router.get('/facebook', passport.authenticate('facebook'));
//
// router.get('/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '../user',
//   failureRedirect: '/'
// }));
//
// router.get('/twitter', passport.authenticate('twitter'));
//
// router.get('/twitter/callback', passport.authenticate('twitter', {
//   successRedirect: '../user',
//   failureRedirect: '/'
// }));
//
// router.get('/user', h.isAuthenticated, (req, res, next) => {
//     res.setHeader('content-type', 'application/json');
//     res.send(req.user);
// });

router.get('/logout', (req, res, next) => {
    req.logout();
    res.send("Logout successfully!");
});

module.exports = router;
