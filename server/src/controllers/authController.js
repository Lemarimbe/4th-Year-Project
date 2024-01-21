const bcrypt = require('bcrypt')
require('dotenv').config()
const createMarkup = require('../utils/createMarkup');

const sendMail = require('../utils/sendMail');
const getAUser = require('../utils/getAUser');
const { tokenGenerator } = require('../utils/token');

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

            if(results.rowsAffected[0] > 0){
                res.status(201).send({
                    success: true,
                    message: "New users successfully added",
                  });
                } else {
                  res.status(500).send({
                    success: false,
                    message: "An error occurred",
                  });
                }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
          });
    }

}

async function login(req, res){
   let { username, password} = req.body;
   const { pool }  = req;

   try {
    let user = await getAUser(username, pool)
    console.log(user)

    if(user){
        let passwords_match = await bcrypt.compare(password, user.password)
        if(passwords_match){
            let token = await tokenGenerator({user});
            console.log(token)
            res.status(200).send({
                success: true,
                message: "Login successful",
                token,
              });
        } else{
            res.status(401).send({
                success: false,
                message: "Invalid login credentials",
              });
        }
        
    } else {
        res.status(401).send({
            success: false,
            message: "No user with this username exists",
          });
    }
    
   } catch (error) {
    res.status(500).send({
        success: false,
        message: error
      });
   }
}

async function registerAdmin(req, res){
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
            .input("role", value.role)
            .execute("InsertUser");

            if(results.rowsAffected[0] > 0){
                res.status(201).send({
                    success: true,
                    message: "New Admin successfully added",
                  });
                } else {
                  res.status(500).send({
                    success: false,
                    message: "An error occurred",
                  });
                }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
          });
    }

}

module.exports = {
    registerUser,
    login,
    registerAdmin
};