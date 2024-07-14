require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))



// init data
require('./db/init.mongodb')

// const { checkOverload } = require('./helpers/check.connect')
// // checkOverload()

// init routes
app.use('/', require('./routes'))


// handling error
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: err.message })
})

module.exports = app