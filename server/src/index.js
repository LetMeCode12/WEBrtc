const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const  UserController  = require("./sequelize/Controllers/UserController");
const io = new Server(server, { cors: { origins: ["*"] } });
const { socketIo } = require("./socketIo");
const cors = require("cors");
const security = require("./security/security")
const sequelize = require('./sequelize/index')
require("dotenv").config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/",security);

socketIo(io);

app.use('/', UserController);

sequelize.sync();

server.listen(port, () => {
  console.log(`APP run at port: ${port}`);
});
