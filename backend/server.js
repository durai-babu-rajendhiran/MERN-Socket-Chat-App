const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Ensure mongoose is required
const { Server } = require('socket.io');
require("dotenv").config();

const app = express();
app.use(express.static(__dirname + "/uploads"));
app.use(cors());

// Connect to the database
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("DB CONNECTED");
}).catch((err) => {
    console.log("DB CONNECTION ERR", err);
});

// Create an HTTP server
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});

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
    console.log(`Socket ${socket.id} connected`);

    socket.on('sendNotification', async (reqobject) => {
        try {
            io.emit(reqobject.id, reqobject);
        } catch (error) {
            console.error('Error handling sendNotification:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});
