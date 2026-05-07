const express = require('express');
const cors = require('cors')
const { postComment, deleteComment } = require('../controller/commentController')
const handleAuth = require('../middleware/auth')


const route = express.Router({mergeParams:true});

route.use(cors())
route.use(express.json())

route.post('/', handleAuth, postComment)
route.delete('/:id',handleAuth, deleteComment)

module.exports = route;