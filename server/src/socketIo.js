let users = [];

const socketIo = (io) => {
  io.on("connection", (socket) => {
    socket.on("user-connected", (data) => {
      users = [
        ...users.filter((e) => e.userId !== data.userId),
        { userId: data.userId, socketId: socket.id },
      ];
      io.sockets.emit("user-update", users);
    });

    socket.on("get-users", () => {
      socket.emit("send-users", { users: users });
    });

    socket.on("call-user", (data) => {
      socket.to(data.to).emit("call-made", {
        offer: data.offer,
        socket: socket.id,
      });
    });

    socket.on("reject-user", (data) => {
      socket.to(data.to).emit("reject-made");
    });

    socket.on("make-answer", (data) => {
      socket.to(data.to).emit("answer-made", {
        socket: socket.id,
        answer: data.answer,
      });
    });

    socket.on("disconnect", () => {
      users = [...users.filter((e) => e.socketId !== socket.id)];
      io.sockets.emit("user-update", users);
    });
  });
};

module.exports = {
  socketIo,
};
