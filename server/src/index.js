const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const  restApi  = require("./restApi");
const io = new Server(server, { cors: { origins: ["*"] } });
const { socketIo } = require("./socketIo");
const cors = require("cors");
const db = require("./sequelize/index");
const security = require("./security/security")
require("dotenv").config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/",security);

socketIo(io);

app.use('/',restApi);

db.db.sequelize.sync();

server.listen(port, () => {
  console.log(`APP run at port: ${port}`);
});
