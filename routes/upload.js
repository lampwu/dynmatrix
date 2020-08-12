const express = require('express');
const router = express.Router();
const fs = require('fs');
const EventEmitter = require('events');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

/* POST upload listing. */

router.post('/', upload.single('dyn'), function (req, res, next) {
  console.log(req.body)
  let receiveTimes = 0;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let sampleFile = req.file;
  let uploadFileName = req.file.name;
    // Use the mv() method to place the file somewhere on your server
    dataConvert(req.file.buffer);
  myEmitter.on('finish', () => {
    receiveTimes += 1;
    if (receiveTimes === 2) {
      res.render('uploadfinish', {title: uploadFileName});
    }
  })
});

router.post('/justupload', upload.single('dyn'), function (req, res, next) {
  if (Object.keys(req.file).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let uploadFileName = req.file.name;
  fs.writeFile(`.\\some\\${uploadFileName + new Date().toLocaleString('zh-TW').split(':').join('-').split('/').join().split(',').join()}`, req.file, (err) => {
    if (err)
      return res.status(500).send(err);
    console.log('moving:' + uploadFileName);
    res.render('uploadfinish', {title: uploadFileName});
  });
});

function dataConvert(sourceData) {
  let sepData = sourceData.toString('utf8').split('\r\n')
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
fs.writeFile(`.\\some\\${currentFileName + new Date().toLocaleString('zh-TW').split(':').join('-').split('/').join().split(',').join()}`, finalDataString, 'utf8', (err) => {
  if (err) throw err;
  myEmitter.emit('finish');
});
};

module.exports = router;
