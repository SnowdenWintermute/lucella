import { ChatChannel } from "../../../common";

// old - delete

export default function sanitizeChatChannelForClient(chatChannels: { [channelName: string]: ChatChannel }, channelName: string) {
  let sanitizedChatChannel: { name: string; connectedUsers: { [userKey: string]: {} } } = {
    name: channelName,
    connectedUsers: {},
  };
  Object.keys(chatChannels[channelName].connectedUsers).forEach((userKey) => {
    let sanitizedUser: { username: string | null; connectedSockets: string[] } = {
      username: null,
      connectedSockets: [],
    };
    let userPropKey: keyof typeof chatChannels.channelName.connectedUsers.userId;
    for (userPropKey in chatChannels[channelName].connectedUsers[userKey]) {
      if (userPropKey !== "connectedSockets") sanitizedUser[userPropKey] = chatChannels[channelName].connectedUsers[userKey][userPropKey];
    }
    sanitizedChatChannel.connectedUsers[userKey] = sanitizedUser;
  });

  console.log("sanitized chat channel line 20");

  return sanitizedChatChannel;
}
