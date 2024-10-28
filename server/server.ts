import { Server } from "socket.io";
import http from "http";
import app from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("socket", socket.id);

  socket.on("connection", (client) => {
    console.log("socket connected", client.id);
  });

  socket.on("client-message", (message) => {
    console.log("receive-from-client", message);
    io.emit("to-all", message);
  });
  
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
