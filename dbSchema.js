const mongoose = require('mongoose');
const validator = require('validator');

var loanSchema = new mongoose.Schema({
    name:{type:'string',required:true},
    mobile:{type:'string',required:true,default:'000-000-0000'},
    amount:{type:"Number",required:true},
    email:{type:'string',required:true,lowecase:true,validate:(value)=>{
        return validator.isEmail(value)
    }},
    purpose:{type:'string',default:'Purpose of loan'},
    createdAt:{type:Date,default:Date.now()}
})

var mentorSchema = new mongoose.Schema({
    firstName:{type:'string',required:true},
    lastName:{type:'string',required:true},
    mobile:{type:"Number",required:true,default:'000-000-0000'},
    email:{type:'string',required:true,lowecase:true,validate:(value)=>{
        return validator.isEmail(value)
    }},
    dob:{type:'string',default:"01-01-2000"},
    mn_id:{type:'string',default:null},
    createdAt:{type:Date,default:Date.now()}
})

var studentSchema = new mongoose.Schema({
    firstName:{type:'string',required:true},
    lastName:{type:'string',required:true},
    mobile:{type:"Number",required:true,default:'000-000-0000'},
    email:{type:'string',required:true,lowecase:true,validate:(value)=>{
        return validator.isEmail(value)
    }},
    dob:{type:'string',default:"01-01-2000"},
    location:{type:'string',default:null},
    mentor_id:{type:'string',default:null},
    createdAt:{type:Date,default:Date.now()}
})

var loanRequest = mongoose.model('leads',loanSchema);
var mentorRequest = mongoose.model('student_mentor_master',mentorSchema);
var studentRequest = mongoose.model('student_master',studentSchema);

module.exports={loanRequest,mentorRequest,studentRequest,mongoose}