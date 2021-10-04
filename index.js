const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 4000
const { MongoClient } = require('mongodb');
const bp = require('body-parser')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))



async function connect() {

    //Connect to database
    const uri = `mongodb+srv://kds4:Mongo123@cluster0.oficb.mongodb.net/task?retryWrites=true&w=majority`;

    mongoose.connect(uri, {useUnifiedTopology: true},{ useNewUrlParser: true } )
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))


    try {

        app
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', (req, res) => res.render('pages/index'))
        .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    } catch(e){

        console.error(e);
    } 

}

const personRouter = require('./routes/routes.js')
app.use('/people', personRouter)

//Start server
connect().catch(console.error);














