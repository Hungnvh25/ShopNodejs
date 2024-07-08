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



// init data
require('./db/init.mongodb')

const { checkOverload } = require('./helpers/check.connect')
checkOverload()
// init routes
app.get('/',(req,res,next)=>{
    return res.status(500).json({
        message : 'Wecome Fantipjs'
    })
})


// handing error

module.exports = app