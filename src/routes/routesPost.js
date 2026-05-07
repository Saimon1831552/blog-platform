const express = require('express');
const cors = require('cors')
const { getAll, getId, post, deletePost,update } = require('../controller/postController')
const handleAuth = require('../middleware/auth')

const route = express.Router();
route.use(cors())
route.use(express.json())

route.get('/',                    getAll)
route.get('/:id',                 getId)
route.post('/',       handleAuth, post)
route.put('/:id',     handleAuth, update)
route.delete('/:id',  handleAuth, deletePost)

module.exports = route;