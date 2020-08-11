const express = require('express');
const router = express.Router();
const fs = require('fs');
const EventEmitter = require('events');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = require('../app');



class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

/* POST upload listing. */

router.post('/', upload.single('avatar'), function (req, res, next) {
  console.log(req.body)
  let receiveTimes = 0;
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let sampleFile = req.file;
  let uploadFileName = req.file.name;
    //let uploadedBuffer = req.file.buffer;
  fs.writeFile(`.\\some\\${req.file.name + Date.now() + '-' + Math.round(Math.random() * 1E9)}`, req.file.buffer, 'utf8', (err) => { //write file to some
    if (err) throw err;
    myEmitter.emit('finish');
  });
    dataConvert(req.file.buffer.toString('utf8'), req.body.basetime, req.body.increasetime); // convert uploadFileName to csv
  myEmitter.on('finish', () => {
    receiveTimes += 1;
    if (receiveTimes === 2) {
      res.render('uploadfinish', {title: uploadFileName});
    }
  })

  res.render('uploadmatrix', { title: "Upload Dynamic Matrix Page "})
  // req.body will hold the text fields, if there were any
});
/*router.post('/', upload.none(), function (req, res, next) {
  // req.body contains the text fields
  console.log(req.body.length())
  res.render('uploadmatrix')
})*/
function dataConvert(sourceData,baseTime,increaseTime) {
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
      testDataMaxs = sepData[i+2].split(';'); //split max output voltage
      testDataMins = sepData[i+3].split(';'); //split min output voltage
      //for(k=0;k<testDataMaxs.length;k++) {
        //let testDataMax = testDataMaxs[k].split(',');
        //let testDataMin = testDataMins[k].split(',');
        /*console.log(testDataMax);
        console.log(testDataMin);*/
        //if ( k < testDataMaxs.length-1 ) {
          console.log(Math.sqrt( testDataMaxs.length ) + 1)
          for (j = 0; j < Math.sqrt( testDataMaxs.length ) + 1; j++ ) {
            for ( m = 0; m < Math.sqrt( testDataMaxs.length ) + 1 ; m++) {
              let testDataMax = testDataMaxs[Math.floor(Math.sqrt( testDataMaxs.length ) ) * j + m ].split(',');
              let testDataMin = testDataMins[Math.floor(Math.sqrt( testDataMaxs.length ) ) * j + m ].split(',');
              maxAndMin.push(`${j}A ~ ${m}A`);
              maxAndMin.push(testDataMax);
              maxAndMin.push(testDataMin);
              maxAndMin.push('\r\n');
            }
          }
        //}
      //}
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
  let finalDataString=finalData.join(',');

  let currentTime = new Date().toLocaleString('zh-TW').split(':').join('-').split('/').join().split(',').join();
  currentFileName = `${currentTime}.csv`;
  fs.writeFile(`.\\some\\${currentFileName}`, finalDataString, 'utf8', (err) => {
    if (err) throw err;
    myEmitter.emit('finish');
  });
};
module.exports = router
