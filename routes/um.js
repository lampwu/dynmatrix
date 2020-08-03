const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('um', { title: "Dynamic Matrix Convert Page "});
});

module.exports = router;
