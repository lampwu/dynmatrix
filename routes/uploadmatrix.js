const express = require('express');
const router = express.Router();
const fs = require('fs');
const EventEmitter = require('events');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

/* POST upload listing. */

router.post('/uploadmatrix', upload.single('avatar'), function (req, res, next) {
   console.log(req.body)
   console.log(req.file)
  // req.body will hold the text fields, if there were any
})

module.exports = router;
