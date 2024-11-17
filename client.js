// needed library

const io = require("socket.io-client");
const readline = require("readline");

// set up connection

const socket = io("http://localhost:3000");

// input user 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

let username = "";

socket.on("connect", () => {
  console.log("Connected to the server"); // sucess connection

  rl.question("Enter your username: ", (input) => { // user input 
    username = input;
    console.log(`Welcome, ${username} to the chat`);
    rl.prompt(); // user can continue 

    rl.on("line", (message) => { // reading and send the input to server 
      if (message.trim()) { // not empty 
        socket.emit("message", { username, message });
      }
      rl.prompt();
    });
  });
});

socket.on("message", (data) => { // receive and display message 
  const { username: senderUsername, message: senderMessage } = data;
  if (senderUsername !== username) { // make sure it's display not in their own
    console.log(`${senderUsername}: ${senderMessage}`);
    rl.prompt();
  }
});

socket.on("disconnect", () => { // when disconnect from server 
  console.log("Server disconnected, Exiting...");
  rl.close(); // stop respond to input 
  process.exit(0);
});

rl.on("SIGINT", () => { // ctrl + c 
  console.log("\nExiting...");
  socket.disconnect();
  rl.close();
  process.exit(0);
});