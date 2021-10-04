const express = require('express')
const router = express.Router()
const Person = require('../models/model')
const { v4: uuidv4 } = require('uuid');



//Create new person
router.post('/', async function(req,res) {

    const person = new Person({
        fname: req.body.fname,
        lname: req.body.lname,
        gender: req.body.gender,
        birthday: req.body.birthday,
        id: uuidv4()
    })

    try {

        const newPerson = await person.save()
        res.status(201).json(newPerson)

    } catch (err) {

        res.status(400).json({ message: err.message })

    }
})



//Get all people from database
router.get(`/`, async function(req,res){

    try {

        const people = await Person.find()
        res.json(people)

    } catch(err) {

        res.status(500).json({ message: err.message })
    
    }
})




//Update one parameter 
router.patch('/', getPerson, async function(req,res) {

    res.person[`${req.body.att}`] = req.body.value

    try {

        const updatedPerson = await res.person.save()
        res.json({ message: "Information updated" })

      } catch (err) {

        res.status(400).json({ message: err.message })

      }
})




//Delete a person from database
router.delete('/', getPerson, async function(req,res) {

    try {

      await res.person.remove()
      res.json({ message: 'Person Deleted' })

    } catch (err) {

      res.status(500).json({ message: err.message })

    }
})




//Find a person based on id
async function getPerson(req, res, next) {
    let person

    try {

      person = await Person.findOne({ id: req.body.id })
      if (person == null) {
        return res.status(404).json({ message: 'Cannot find person' })
      }

    } catch (err) {

      return res.status(500).json({ message: err.message })

    }
  
    res.person = person
    next()
}



module.exports = router





