const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { restApi } = require("./restApi");
const io = new Server(server, { cors: { origins: ["*"] } });
const { socketIo } = require("./socketIo");
const cors = require("cors");

const port = 8000;

app.use(cors());

socketIo(io);

restApi(app);

server.listen(port, () => {
  console.log(`APP run at port: ${port}`);
});
