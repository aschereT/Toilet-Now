// Code based on https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
const sql = require('mssql')
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MS SQL database
//const dbRoute = "sqlserver://ubcwashrooms:Password1@ubcwashrooms.database.windows.net:1433/ubcwashrooms?encrypt=true";

const config = {
    user: 'ubcwashrooms',
    password: 'Password1',
    server: 'ubcwashrooms.database.windows.net',
    database: 'ubcwashrooms',
    port: 1433,
    encrypt: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}

sql.connect(config).then(pool => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(logger("dev"));

    // this is our get method
    // this method fetches all available data in our database
    router.get("/getToilets", (req, res) => {
        const { lat, lon, range } = req.body;
        console.log("Lat is " + lat + ", lon is " + lon + ", range is " + range)
        //included in the body are 3 parameters: latlon of user, and range they want
        //this server-side function then queries database to find the toilets near the user
        //and send it back to the client
        //TODO: actually filter
        const result = pool.request().query(`select * from toilets`).then(result => {
            console.log("Result from DB is " + result.recordsets)
            return res.json({ success: true, data: result.recordsets });
        }).catch(err => {
            console.log("Failed to query database, " + err)
            return res.json({ success: false, error: err });
        })
    });

    // append /api for our http requests
    app.use("/api", router);

    // launch our backend into a port
    app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
}).catch(err => {
    // ... error checks
    console.log("Failed to connect to database, please restart app")
    console.log("Error is " + err)
})

