var express = require("express");
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get("/get", (req, res) => {
  console.log("demo GET method for /get");
  res.setHeader('content-type', 'application/json');
  res.send({name:"demo", version:"2"});
});

router.post("/post", (req, res) => {
  console.log("demo POST method for /post");
  res.json(req.body);
});

router.get("/get_local_auth", (req, res) => {
  var token = req.query.token;
  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      res.send(decoded._id);
    }
  });
});

module.exports = router;
