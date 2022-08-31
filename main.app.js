// imports
const express = require("express");
const proto = require("http");
const morgan = require("morgan");
const { petApp } = require("./pet.app");
const { client } = require("./db/mongo.client");
const { FileTypeError } = require("./main.helper");


// env variables
require("dotenv").config()
const {PORT, CONNECTION_STRING} = process.env;

// create app
const app = express()

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("dev"))

// routers
app.use("/api", petApp);

// error handler
app.use((err, req, res, next) => {
    switch(err){
        case FileTypeError:
            res.status(500).json({
                errorMessage: err.message,
                suggestion: "upload only excel file"
            });
            break;
        default:
            res.status(500).json({
                errorMessage: err.message
            });
    }
    next(err);
});


// connect db
client.use(CONNECTION_STRING).stayConnected();

// start server
proto
.createServer(app).listen(PORT, ()=>{
    console.log(`Started Server at http://localhost:${PORT}`);
})
.on('error', (e) => {
    switch(e.code){
        case 'EADDRINUSE':
            console.log('Address in use, retrying...');
            setTimeout(() => {
                server.close();
                server.listen(PORT);
            }, RETRY_INTERVAL);
            break;
        default:
            console.error(e.message, e.code);
    }
});