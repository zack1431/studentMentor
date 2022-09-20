var express = require('express');
var router = express.Router();
const {mongodb,dbName,dbUrl,MongoClient} = require('../db');
const {mentorRequest,studentRequest,mongoose} = require('../dbSchema');
var client = new MongoClient(dbUrl);

mongoose.connect(dbUrl);
/* GET home page. and mentor list*/
router.get('/mentor', async (req, res,)=> {
  // await client.connect()
  try {
    let users = await mentorRequest.find()
    res.send({
      statusCode:200,
      users
    })
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal server error"
    })
  }
});

// update mentor
router.put('/mentor/:id', async function(req, res, next) {
  try{
      let request = await mentorRequest.updateOne({ _id: mongodb.ObjectId(req.params.id) },req.body);
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});


/* create mentor */
router.post('/create-mentor',async (req,res)=>{
  // await client.connect();
  try {
    let users = await mentorRequest.create(req.body)
    // console.log(users)
    var id = users._id.toString();
    // console.log(id);
    let update = await mentorRequest.updateOne({_id:mongodb.ObjectId(id)},{
      $set:{
        mn_id:id
      }
    })
    let request = await mentorRequest.find({ _id: mongodb.ObjectId(id) }).exec();
    // console.log(request)
    res.send({
      statusCode:res.statusCode,
      message:"Mentor created Successfully!",
      data : request
    })
  } catch (error) {
      console.log(error)
      res.send({
        statusCode:500,
        message:"Internal server error"
      })
  }
})

/**delete mentor */

router.delete('/mentor/:id', async function(req, res, next) {
  try{
      let request = await mentorRequest.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

router.get('/nonAssignedStd', async (req, res,)=> {
  // await client.connect()
  try {
    // const db = await client.db(dbName)
    let users = await studentRequest.find({mentor_id:{$eq:null}}).exec()
    res.send({
      statusCode:200,
      users
    })
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal server error"
    })
  }
});

/**create student */
router.post('/create-student',async (req,res)=>{
  try {
    let users = await studentRequest.create(req.body)

    res.send({
      statusCode:200,
      message:"Student created Successfully!",
      users
    })
  } catch (error) {
      console.log(error)
      res.send({
        statusCode:500,
        message:"Internal server error"
      })
  }
})


/**list all students assigned to mentor */
router.get('/showAll', async (req, res,)=> {
  await client.connect();
  try {
    const db = await client.db('test');
    let resp = await db.collection('student_masters').aggregate([
      { $lookup:
         {
           from: 'student_mentor_masters',
           localField: 'mentor_id',
           foreignField: 'mn_id',
           as: 'studentDetails'
         },
       },
       {
        $unwind: "$studentDetails"
        }
      ]).toArray()
      res.send({
        statusCode:res.statusCode,
        data:resp
      })
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal server error"
    })
  }
  finally{
    client.close()
  }
});

// update student
router.put('/student/:id', async function(req, res, next) {
  try{
      let request = await studentRequest.updateOne({ _id: mongodb.ObjectId(req.params.id) },req.body);
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

/**delete student */

router.delete('/student/:id', async function(req, res, next) {
  try{
      let request = await studentRequest.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
      res.send({
        status:res.statusCode,
        data:request
      })
  }
  catch(error){
    res.send({status:res.statusCode,message:error})
  }
});

// assign multi student with one mentor
router.post('/assignMulti/:id',async (req,res)=>{
  try {
    var data = [];
    var temp = [];
    temp = JSON.parse(req.body.temp);
    temp.forEach(val =>{
      data.push(mongodb.ObjectId(val))
    })
    console.log(data)
    let users = await studentRequest.updateMany({"_id":{$in:data}},{$set:{"mentor_id":req.params.id}})
    let getUpdated = await studentRequest.find().exec()
    res.send({
      statusCode:200,
      message:"Student Assigned Successfully!",
      getUpdated
    })
  } catch (error) {
      console.log(error)
      res.send({
        statusCode:500,
        message:"Internal server error"
      })
  }
})

module.exports = router;
