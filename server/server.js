const express = require('express');
require('dotenv').config();
const sql = require('mssql');
const config = require('./src/config/config');

const authRouter = require("./src/routes/authRoutes");

const app = express();

app.use(express.json());

async function connectToDB(){
    try {
        const pool = await sql.connect(config)
        console.log('firstConnection')

        app.use((req, res, next) => { req.pool = pool; next() })

        app.set("view engine", "ejs")

        app.get(
          "/",
          (req, res, next) => {
            let cont = true;
            if (cont) {
              console.log("Hello from the middleware");
              next();
            } else {
              res.send("Error logged from middleware");
            }
          },
          (req, res) => {
    
            res.send("Ok")
          }
        );

        app.use(authRouter)

        app.use("*", (req, res, next) => {
            const error = new Error("Route Not found");
            next({
              status: 404,
              message: error.message,
            });
          });
      
          app.use((error, req, res, next) => {
            res.status(500).send({
              success: false,
              message: error.message,
            });
          });

          const port = process.env.PORT;

    app.listen(port, () => console.log(`Server on port: ${port}`));
    } catch (error) {
        console.log('Error connecting to the database')
    console.log(error)
    }
}
connectToDB();