const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("config");
const User = require("../../../models/User");

const socketConnects = async ({ socket, connectedSockets }) => {
  let token = socket.handshake.query.token;
  let decoded;
  let userToReturn;
  console.log("socket " + socket.id + " connected");
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
    userToReturn = await User.findById(decoded.user.id).select("-password");
  } catch (err) {
    userToReturn = { name: "Anon", isGuest: true };
  }
  // connectedSockets object:
  connectedSockets[socket.id] = {
    username: userToReturn.name,
    uuid: uuid.v4(),
    socketId: socket.id,
  };
  return userToReturn;
};

module.exports = socketConnects;
