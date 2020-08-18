const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

/* GET convert listing. */
router.get('/', (req, res) => {
    console.log(req.path)
    let realDir = path.join('./some', req.path)
    console.log(path.dirname(realDir))
    fs.readdir(realDir, 'utf8', (err, files) => {
        console.log(files)
        if (err) throw new Error
    res.render('allfile', {catalog: files});
    res.end;
    });
})

router.get(`/file/:id`, (req, res) => {
    console.log(req.params.id)
    res.download(`./some/${req.params.id}`);
})

module.exports = router;
