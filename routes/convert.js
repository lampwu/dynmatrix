const express = require('express');
const router = express.Router();

/* GET convert listing. */
router.get('/', function(req, res, next) {
  res.render('convert', { title: "Convert Page "});
});


module.exports = router;
