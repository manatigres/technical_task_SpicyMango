const mongoose = require('mongoose')

//Create new schema for database
const personSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  id:{
    type: String
  }},{
    versionKey: false 
})

module.exports = mongoose.model('Person', personSchema)