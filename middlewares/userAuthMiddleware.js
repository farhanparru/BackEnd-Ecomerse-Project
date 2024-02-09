const jwt = require('jsonwebtoken')

module.exports = function verifyToken (req,res, next) {
    // JSON Web Tokens (JWTs) sent in the headers of incoming requests.
    const token = req.headers["authorization"]
        console.log(token);
    //If no token is found, it responds with a 403 status code and an error message.
    if(!token){
        return res.status(403).send({error:"No token Provided 🙆🏻‍♂️"})
    }
    //If a token is found, it attempts to verify the token using the jwt.verify() method. This method takes three arguments: the token, a secret key, and a callback function. The secret key is retrieved from the environment variable ADMIN_ACCES_TOKEN_SECRET.
    jwt.verify(token, process.env.USER_ACCES_TOKEN_SECRET,(err, decode) => {
                    console.log(err,"hau");
        if(err) {    
           
            return res.status(401).json({error: "Unathorazed😠"})
        }
        req.username = decode.username
        next()    
    })

}