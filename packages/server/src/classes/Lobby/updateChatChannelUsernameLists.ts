import { ChatChannel, SocketMetadata } from "@lucella/common";

export default function updateChatChannelUsernameLists(
  chatChannels: { [name: string]: ChatChannel },
  socketMeta: SocketMetadata,
  channelNameLeaving: string | null,
  channelNameJoining: string | null
) {
  const username = socketMeta.associatedUser.username;
  if (channelNameLeaving) {
    const channelLeaving = chatChannels[channelNameLeaving];
    if (!channelLeaving) return;
    const userInRoom = channelLeaving.connectedUsers[username];
    // logged in users can have multiple socket connections in one chat channel, each under their username umbrella. Only remove the user if they have 0 socket connections
    let newSocketList: string[] = [];
    if (userInRoom) newSocketList = userInRoom.connectedSockets.filter((socketInThisChannel) => socketInThisChannel !== socketMeta.socketId);
    if (newSocketList.length < 1) delete channelLeaving.connectedUsers[username];
    else userInRoom.connectedSockets = newSocketList;
    if (channelLeaving.connectedUsers[username] && Object.keys(channelLeaving.connectedUsers).length < 1) delete chatChannels[channelNameLeaving];
    console.log(`${socketMeta.socketId} removed from ${channelNameLeaving}'s list`);
  }
  if (channelNameJoining) {
    if (!chatChannels[channelNameJoining]) chatChannels[channelNameJoining] = new ChatChannel(channelNameJoining);
    const channelJoining = chatChannels[channelNameJoining];
    if (!channelJoining.connectedUsers[username])
      channelJoining.connectedUsers[username] = {
        username,
        connectedSockets: [socketMeta.socketId!],
      };
    else channelJoining.connectedUsers[username].connectedSockets.push(socketMeta.socketId!);
    console.log(`${socketMeta.socketId} added to ${channelNameJoining}'s list`);
  }
}
