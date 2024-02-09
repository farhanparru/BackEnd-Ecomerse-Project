const jwt = require("jsonwebtoken")

module.exports = function verifyToken(req,res,next){
    //Extracts the token from the "Authorization" header of the incoming request.
    const token = req.headers["authorization"]
    
    if(!token){
        return res.status(403).json({error:"No token Provided 🙆🏻‍♂️"})
    }


  

    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {


        
        if(err){
            return res.status(403).json({error:"Unathorazed😠"})
        }

        req.email = decoded.email
       
        next()
    })
}