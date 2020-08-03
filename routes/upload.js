const express = require('express');
const router = express.Router();
const fs = require('fs');
const EventEmitter = require('events');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

/* POST upload listing. */

router.post('/', function(req, res) {
    let receiveTimes = 0;
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let uploadFileName = req.files.sampleFile.name;
    let uploadedBuffer = req.files.sampleFile.data.toString('utf8');
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`.\\some\\${uploadFileName}`, (err) => {
      if (err)
        return res.status(500).send(err);
      console.log('moving:' + uploadFileName);
      myEmitter.emit('finish');
    });
    dataConvert(uploadedBuffer);
    function dataConvert(sourceData) {
      let sepData = sourceData.split('\r\n')
      /*console.log(sepData)
      console.log((sepData.length-1)/3)*/
      let testDataMaxs;
      let testDataMins;
  
      let testTime = '';
      let testNameAndOutPut = '';
      let finalData = [];
      for(i = 0; i<=sepData.length-5; i=i+4) {
          let maxAndMin = [];
          testTime = sepData[i];
          testNameAndOutPut = sepData[i+1];
          testDataMaxs = sepData[i+2].split(';');
          testDataMins = sepData[i+3].split(';');
          for(k=0;k<testDataMaxs.length;k++) {
              let testDataMax = testDataMaxs[k].split(',');
              let testDataMin = testDataMins[k].split(',');
              /*console.log(testDataMax);
              console.log(testDataMin);*/
              if ( k < testDataMaxs.length-1 ) { maxAndMin.push(`0-${k}A`) };
              /*for(m=0;m<testDataMax.length;m++){*/
              maxAndMin.push(testDataMax[0]);
              maxAndMin.push(testDataMin[0]);
              /*}*/
              maxAndMin.push('\r\n')
          }
          finalData.push(testTime);
          finalData.push(testNameAndOutPut);
          finalData.push('\r\n');
          finalData.push('');
          finalData.push('Max');
          finalData.push('Min');
          finalData.push('\r\n');
          finalData.push(maxAndMin);
          finalData.push('\r\n');
      }
      let finalDataString=finalData.join(',')
      let currentTime = new Date().toLocaleString().split(':').join('-');
      currentFileName = `${currentTime}.csv`
    fs.writeFile(`.\\some\\${currentFileName}`, finalDataString, 'utf8', (err) => {
      if (err) throw err;
      myEmitter.emit('finish');
    });
  };
  myEmitter.on('finish', () => {
    receiveTimes += 1;
    if (receiveTimes === 2) {
      res.render('uploadfinish', {title: uploadFileName});
    }
  })
});

router.post('/justupload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let uploadFileName = req.files.sampleFile.name;
  //let uploadedBuffer = req.files.sampleFile.data.toString('utf8');
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`.\\some\\${uploadFileName}`, (err) => {
    if (err)
      return res.status(500).send(err);
    console.log('moving:' + uploadFileName);
    res.render('uploadfinish', {title: uploadFileName});
  });
});

module.exports = router;
