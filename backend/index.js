const express = require('express')
const cors = require('cors')

const app = express()

//config json response
app.use(express.json())

//solve cors
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:3001'
}))

//Public folder for img
app.use(express.static('public'))

// Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)


app.listen(3003)