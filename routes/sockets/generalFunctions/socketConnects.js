const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const config = require("config");
const User = require("../../../models/User");

const socketConnects = async ({ socket, connectedSockets }) => {
  let token = socket.handshake.query.token;
  let decoded;
  let userToReturn;
  let isGuest;
  console.log("socket " + socket.id + " connected");
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
    userToReturn = await User.findById(decoded.user.id).select("-password");
    isGuest = false;
  } catch (err) {
    isGuest = true;
    userToReturn = { name: "Anon", isGuest: true };
  }
  // connectedSockets object:
  connectedSockets[socket.id] = {
    username: userToReturn.name,
    uuid: uuid.v4(),
    socketId: socket.id,
    isGuest: isGuest,
  };
  return userToReturn;
};

module.exports = socketConnects;
