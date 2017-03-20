var express = require("express");
var router = express.Router();

router.get("/get", (req, res) => {
  console.log("demo GET method for /get");
  res.setHeader('content-type', 'application/json');
  res.send({name:"demo", version:"2"});
});

router.post("/post", (req, res) => {
  console.log("demo POST method for /post");
  res.setHeader('content-type', 'application/json');
  res.send(req.body);
});

module.exports = router;
