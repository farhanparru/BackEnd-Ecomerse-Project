const jwt = require("jsonwebtoken")

module.exports = function verifyToken(req,res,next){
    //Extracts the token from the "Authorization" header of the incoming request.
    const token = req.headers["authorization"]
    
    if(!token){
        return res.status(403).json({error:"No token Provided 🙆🏻‍♂️"})
    }
    console.log(token,"farhan");

    // const token = Token.split(' ')[0];   
    // console.log(token,'ggg'); 
  
    if (!token) {
      return res.status(403).json({ error: "Malformed token" });
    }

    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {

        // console.log("env", process.env.ADMIN_ACCESS_TOKEN_SECRET);
        
        if(err){
            return res.status(403).json({error:"Unathorazed😠"})
        }

        req.email = decoded.email
       
        next()
    })
}