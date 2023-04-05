import { Server } from "socket.io";

let totalUsers = 0;

const createSocketServer = (expressServer) => {
  const io = new Server(expressServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("a user is connected");
    totalUsers++;
    io.emit("USER_CONNECTED", { id: socket.id, totalUsers });
    socket.on("MESSAGE", (data) => {
      socket.broadcast.emit("MESSAGE", {
        ...data,
        userId: socket.id,
      });
    });
    socket.on("disconnect", () => {
      totalUsers--;
      socket.broadcast.emit("USER_DISCONNECTED", {
        id: socket.id,
        totalUsers,
      });
    });
  });
};

export default createSocketServer;
