const http = require("http");
const socketIo = require("socket.io");

// make connection to server 

const server = http.createServer();
const io = socketIo(server);

// when client connect

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

// handl eincoming messages from client 

  socket.on("message", (data) => {
    const { username, message } = data; // data = message and uname
    io.emit("message", { username, message }); // send the message to intended client 
  });

  socket.on("disconnect", () => { // when client disconnect 
    console.log(`Client ${socket.id} disconnected`);
  });
});

const port = 3000; // run on port 3000
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});