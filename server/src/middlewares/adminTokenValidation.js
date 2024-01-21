const { tokenVerifier } = require("../utils/token");


async function adminTokenValidation(req, res, next) {
    let token = req.headers['authorization']?.split(' ')[1];
    try{
      if(!token) return next({status:400, message: 'Token not provided'})
     let user = await tokenVerifier(token);
    
     if (user) {
        console.log(user)
         req.user = user;
         let role = user.user.role
         console.log(role)
         if(role === "Admin"){
            next()
         } else{
            next({ status: 401, message: "Unauthorized" });
         }
         
     }
    } catch(error){
     next({status:401, message: error.message})

    }
}

module.exports = adminTokenValidation;