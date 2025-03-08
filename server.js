const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

app.use(express.static(__dirname));

io.on("connection", (socket) => {
    console.log("Un utilizator s-a conectat");

    socket.on("new-user", (username) => {
        users.push({ id: socket.id, username });
        io.emit("users-online", users.map(user => user.username));
    });

    socket.on("send-message", (message) => {
        const user = users.find(u => u.id === socket.id);
        if (user) {
            io.emit("receive-message", { user: user.username, message });
        }
    });

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit("users-online", users.map(user => user.username));
    });
});

server.listen(3000, () => {
    console.log("Serverul rulează pe portul 3000");
});
