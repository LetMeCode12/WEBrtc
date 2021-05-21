const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { restApi } = require("./restApi");
const io = new Server(server, { cors: { origins: ["*"] } });
const { socketIo } = require("./socketIo");
const cors = require("cors");
const db = require("./sequelize/index");
const { encode, compare } = require("./security/securityUtils");
require("dotenv").config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

encode("agaciakupu").then(async(hash) => {
  console.log("hash:", hash);
  console.log("compare:",await compare("agaciakupu",hash))
});

socketIo(io);

restApi(app);

db.db.sequelize.sync();

server.listen(port, () => {
  console.log(`APP run at port: ${port}`);
});
