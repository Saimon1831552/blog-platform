const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json())

app.use('/api/auth', require('./routes/routesAuth'))
app.use('/api/post', require('./routes/routesPost'));
app.use('/api/post/:id/comments', require('./routes/routesComment'))
app.use('/comments', require('./routes/routesComment'))

const port = process.env.PORT;
console.log(port);
app.listen(port, (err)=>{
    console.log(`server running on localhost:${port}`);
})