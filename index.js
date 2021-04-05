const express = require('express');
const cors = require('cors');
const app = express()
const port = 5000;
const opinionRouter = require('./routes/OpinionRouter')

app.use('/', opinionRouter)

app.listen(port, () => {
    console.log(`server is starting on ${port}`)
})