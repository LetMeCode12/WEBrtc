const UserController = require("./sequelize/Controllers/UserController");
const multer = require("multer")();
const fs = require("fs");
const { authenticationToken } = require("./security/jwt");

const restApi = (app) => {
  app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
  });

  app.get("/users",authenticationToken, UserController.getAll);

  app.post("/user/register", UserController.create);

  app.post("/user/image/save", multer.single("photo"), (req, res) => {
    if (req.body && req.file) {
      if (!["jpg", "png"].includes(req.file.originalname.split(".")[1])) {
        return res.status(500).send("Wrong type file");
      }
      fs.writeFile(
        __dirname +
          "/files/avatars/" +
          req.body.userId +
          "." +
          req.file.originalname.split(".")[1],
        req.file.buffer,
        (err) => {
          if (err) {
            return res.status(500).send();
          }
        }
      );
      return res.status(200).send();
    }
    res.status(500).send();
  });
};

module.exports = {
  restApi,
};
