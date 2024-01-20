const bcrypt = require('bcrypt')
require('dotenv').config()
const createMarkup = require('../utils/createMarkup');

const sendMail = require('../utils/sendMail');
const getAUser = require('../utils/getAUser');

async function registerUser(req, res){
    let user = req.body;
    console.log(user)

    try {
        let { value } = req;
        console.log(value)
        let hashed_pwd = await bcrypt.hash(user.password, 8);

        const { pool } = req;
        
        if (pool.connected) {
            let results = await pool
            .request()
            .input("username", value.username)
            .input("email", value.email)
            .input("password", hashed_pwd)
            .input("name", value.name)
            .execute("InsertUser");

            console.log(results);
        }
    } catch (error) {
        console.log(error)
    }

}

async function login(req, res){
   let { username, password} = req.body;
   const { pool }  = req;

   try {
    let user = await getAUser(username, pool)
    
   } catch (error) {
    
   }
}

module.exports = {
    registerUser
};