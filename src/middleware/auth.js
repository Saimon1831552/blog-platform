const jwt = require('jsonwebtoken');
require('dotenv').config()

const handleAuth =(req, res, next)=>{

    const headerRequest = req.headers['authorization'];
    const token = headerRequest && headerRequest.split(' ')[1];

    if(!token){
        return res.status(403).json({message:'Token not provided'})
    }

    try{
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded;
        next()
    }catch(err){
       res.status(403).json({ message: 'Invalid token' })
    }

}
module.exports = handleAuth;