import { ChatChannel } from "../../../common";

export default function sanitizeChatChannelForClient(
  chatChannels: { [channelName: string]: ChatChannel },
  channelName: string
) {
  let sanitizedChatChannel: { channelName: string; connectedUsers: { [userKey: string]: {} } } = {
    channelName,
    connectedUsers: {},
  };
  Object.keys(chatChannels[channelName].connectedUsers).forEach((userKey) => {
    let sanitizedUser: { username: string | null; connectedSockets: string[] } = {
      username: null,
      connectedSockets: [],
    };
    let userPropKey: keyof typeof chatChannels.channelName.connectedUsers.userId;
    for (userPropKey in chatChannels[channelName].connectedUsers[userKey]) {
      if (userPropKey !== "connectedSockets")
        sanitizedUser[userPropKey] = chatChannels[channelName].connectedUsers[userKey][userPropKey];
    }
    sanitizedChatChannel.connectedUsers[userKey] = sanitizedUser;
  });
  return sanitizedChatChannel;
}
