var express = require('express');
var router = express.Router();
var dotenv = require('dotenv')
var AWS = require('aws-sdk');

dotenv.config();
const labellingService = (image) => {

  /*Setting up aws configuration*/
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const client = new AWS.Rekognition();
  const params = {
      Image: {
        Bytes: image,
      },
      MaxLabels: 10 
    };
  
  return client.detectLabels(params).promise();
}

router.post('/classify', async function(req, res) {
  // DON'T return the hardcoded response after implementing the backend
  let response = [];

  // Your code starts here //

  /* Fetching and reading the image files*/
  const file = req.files.file;
  const data = file.data;
  const image = Buffer.from(data, 'base64');

  try{
    response = await labellingService(image) 
    const result = response.Labels.map((label) => label.Name);
    console.log('Result', result)
    return res.json({
      labels: result,
    });

  } catch (err) {
    console.error('Error Log', err)
    return res.status(500).json({ "error": "Unable to process the request" });  
  }
 
  // Your code ends here //

 
});

module.exports = router;
