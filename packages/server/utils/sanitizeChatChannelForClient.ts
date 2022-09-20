import ChatChannel from "../classes/ChatChannel";

export default function sanitizeChatChannelForClient(
  chatChannels: { [channelName: string]: ChatChannel },
  channelName: string
) {
  let sanitizedChatChannel = { channelName: channelName, connectedUsers: {} };
  Object.keys(chatChannels[channelName].connectedUsers).forEach((userKey) => {
    let sanitizedUser = {};
    Object.keys(chatChannels[channelName].connectedUsers[userKey]).forEach((userPropKey) => {
      if (userPropKey !== "connectedSockets") {
        sanitizedUser[userPropKey] = chatChannels[channelName].connectedUsers[userKey][userPropKey];
      }
    });
    sanitizedChatChannel.connectedUsers[userKey] = sanitizedUser;
  });
  return sanitizedChatChannel;
}
