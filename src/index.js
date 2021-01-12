const express = require('express')
// Import routers
// const router = require('./routers/example')

const app = express()
app.use(express.json())
// Link routers
// app.use(example)

app.listen(3000, () => {
    console.log('Express up on port:'+3000)
})