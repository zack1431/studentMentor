var express = require('express');
var router = express.Router();
const {mongodb,dbName,dbUrl,MongoClient} = require('../db');
const {loanRequest,mongoose} = require('../dbSchema');

mongoose.connect(dbUrl);
/* GET users listing. */
router.get('/request', async function(req, res, next) {
  try{
      let request = await loanRequest.find();
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

router.post('/request', async function(req, res, next) {
  try{
    console.log(req.body)
      let request = await loanRequest.create(req.body);
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

router.delete('/request/:id', async function(req, res, next) {
  try{
      let request = await loanRequest.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

router.put('/request/:id', async function(req, res, next) {
  try{
      let request = await loanRequest.updateOne({ _id: mongodb.ObjectId(req.params.id) },req.body);
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});
module.exports = router;
