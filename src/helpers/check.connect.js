'us strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count connect
const countConnect = ()=>{
    const numConnetion = mongoose.connections.length
    console.log(`Number of connection: ${numConnetion}`)
}


// check over load

const checkOverload = () =>{
    setInterval(()=>{
        const numConnetion = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        
        const maxConnections = numCores * 5

        console.log(`Memory usage:: ${memoryUsage/1024/1024} MB`)

        if(numConnetion > maxConnections){
            console.log(`Connection Overload detected!`)
        }

    },_SECONDS)
}
module.exports = {
    countConnect,
    checkOverload
}