const express = require('express')
const { connection } = require('./config/db')
const { UserRouter } = require('./routes/user.route')



const app = express()
app.use(express.json())

app.use('/user',UserRouter)

app.listen(process.env.Port,async()=>{

    try{
        await connection
        console.log('Connected to DB')
    }catch(err){
        console.log('Error connecting to DB')
        console.log('error',err)
    }
})