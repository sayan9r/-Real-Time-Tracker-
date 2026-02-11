const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function (socket) {
  socket.on("send-location" , function(data){
    io.emit("recive-location" , {id: socket.id , ...data});
    });
  socket.on('disconnect', function () {
  io.emit("user-disconnected" , socket.id);
  });
    console.log('A user connected');
});

app.get('/', function (req, res)  {
    res.render('index');
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


server.listen(3000);