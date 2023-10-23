//
let io;

module.exports = {
  // we have two functions init methods and getIO method
  init: (httpServer) => {
    // this is the server that is created in app.js
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    // this is a getter function
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
