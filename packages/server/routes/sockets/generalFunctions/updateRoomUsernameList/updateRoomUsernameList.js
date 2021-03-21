module.exports = ({ socket, connectedSockets, roomToLeave, roomToJoin }) => {
  if (roomToLeave) userLeavingRoom({ socket, connectedSockets, roomToLeave });
  if (roomToJoin) userJoiningRoom({ roomToJoin });
};
