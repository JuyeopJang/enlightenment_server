const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000;
const opinionRouter = require('./routes/OpinionRouter')
const mapRouter = require('./routes/mapRouter')

app.use(cors())
app.use('/', opinionRouter)
app.use('/map', mapRouter)

app.listen(port, () => {
    console.log(`server is starting on ${port}`)
})