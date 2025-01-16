const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Ensure mongoose is required
const { Server } = require('socket.io');
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const { readdirSync } = require("fs");
const app = express();
app.use(express.static(__dirname + "/uploads"));
app.use(cors());
app.use(bodyParser.json({ limit: "1000mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(jsonParser);
app.use(urlencodedParser);
app.use(morgan("dev"));

// Connect to the database
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("DB CONNECTED");
}).catch((err) => {
    console.log("DB ERR", err);
});

// Create an HTTP server
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});

readdirSync("./src/v1/router").map((r) =>
    app.use("/api", require("./src/v1/router/" + r))
);
// Create a Socket.IO server
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000'
            ];
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true); // Allow the origin
            } else {
                callback(new Error('Not allowed by CORS')); // Deny the origin
            }
        },
        credentials: true,
    },
})

// Handle socket connections
io.on('connection', (socket) => {
    socket.on('sendMessage', async(nodeID) => {
        try {
            io.emit(nodeID, nodeID);
        } catch (error) {
            console.error('Error handling sendMSG:');
        }
    });
    
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});
