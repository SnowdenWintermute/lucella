const userLeavingRoom = require('./userLeavingRoom')
const userJoiningRoom = require('./userJoiningRoom')

module.exports = ({ application, nameOfRoomToLeave, nameOfRoomToJoin }) => {
  if (nameOfRoomToLeave) userLeavingRoom({ application, nameOfRoomToLeave });
  if (nameOfRoomToJoin) userJoiningRoom({ application, nameOfRoomToJoin });
};
