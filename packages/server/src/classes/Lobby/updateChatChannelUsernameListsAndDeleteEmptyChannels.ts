/* eslint-disable no-param-reassign */
import { toKebabCase, ChatChannel, SocketMetadata } from "../../../../common";

export default function updateChatChannelUsernameListsAndDeleteEmptyChannels(
  chatChannels: { [name: string]: ChatChannel },
  socketMeta: SocketMetadata,
  channelNameLeaving: string | null | undefined,
  channelNameJoining: string | null
) {
  if (channelNameLeaving) channelNameLeaving = toKebabCase(channelNameLeaving);
  if (channelNameJoining) channelNameJoining = toKebabCase(channelNameJoining);

  const { username, isGuest } = socketMeta.associatedUser;

  if (channelNameLeaving) {
    const channelLeaving = chatChannels[channelNameLeaving];
    if (!channelLeaving) return;
    const userInRoom = channelLeaving.connectedUsers[username];
    // logged in users can have multiple socket connections in one chat channel, each under their username umbrella. Only remove the user if they have 0 socket connections
    let newListOfUsersSocketsInThisRoom: string[] = [];
    if (userInRoom) newListOfUsersSocketsInThisRoom = userInRoom.connectedSockets.filter((socketInThisChannel) => socketInThisChannel !== socketMeta.socketId);
    if (newListOfUsersSocketsInThisRoom.length < 1) delete channelLeaving.connectedUsers[username];
    else userInRoom.connectedSockets = newListOfUsersSocketsInThisRoom;
    if (Object.keys(channelLeaving.connectedUsers).length < 1) delete chatChannels[channelNameLeaving];
    console.log(`${socketMeta.socketId} removed from ${channelNameLeaving}'s list`);
  }

  if (channelNameJoining) {
    if (!chatChannels[channelNameJoining]) chatChannels[channelNameJoining] = new ChatChannel(channelNameJoining);
    const channelJoining = chatChannels[channelNameJoining];
    if (!channelJoining.connectedUsers[username])
      channelJoining.connectedUsers[username] = {
        username,
        isGuest,
        connectedSockets: [socketMeta.socketId!],
      };
    else channelJoining.connectedUsers[username].connectedSockets.push(socketMeta.socketId!);
    console.log(`${socketMeta.associatedUser.username} added to ${channelNameJoining}'s list`);
  }
}
