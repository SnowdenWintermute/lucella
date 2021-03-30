const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const User = require("../../../models/User");

module.exports = async ({ socket, connectedSockets }) => {
  let token = socket.handshake.query.token;
  let decoded;
  let userToReturn;
  let isGuest;
  if (token !== "null") {
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      userToReturn = await User.findById(decoded.user.id).select("-password");
      isGuest = false;
    } catch (error) {
      console.log(error);
    }
  }
  if (!userToReturn) {
    isGuest = true;
    userToReturn = { name: "Anon", isGuest: true };
  }
  connectedSockets[socket.id] = {
    username: userToReturn.name,
    uuid: uuid.v4(),
    socketId: socket.id,
    isGuest: isGuest,
  };
  console.log("socket " + socket.id + " connected");
  return userToReturn;
};
