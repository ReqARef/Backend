const express = require('express')
// Import routers
// const router = require('./routers/example')
const pool = require('./db/database')

const makeQuery = async () => {
    const res = await pool.query('SELECT * from test')
    console.log('\n', res)
}

makeQuery()

const app = express()
app.use(express.json())
// Link routers
// app.use(example)


app.listen(3000, () => {
    console.log('Express up on port:'+3000)
})