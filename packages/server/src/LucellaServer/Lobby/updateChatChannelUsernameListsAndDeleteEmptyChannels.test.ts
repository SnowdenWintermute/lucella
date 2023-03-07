import { battleRoomDefaultChatChannel, ChatChannel, defaultChatChannelNames, SocketMetadata, toKebabCase } from "../../../../common";
import { TEST_USER_NAME } from "../../utils/test-utils/consts";
import updateChatChannelUsernameListsAndDeleteEmptyChannels from "./updateChatChannelUsernameListsAndDeleteEmptyChannels";

describe("updateChatChannelUsernameListsAndDeleteEmptyChannels", () => {
  const socketId = "1234abcd";
  const socketMeta = new SocketMetadata(socketId, "192", { username: TEST_USER_NAME, isGuest: false }, battleRoomDefaultChatChannel);
  const socketId2 = "abcd1234";
  const socketMeta2 = new SocketMetadata(socketId2, "192", { username: TEST_USER_NAME, isGuest: false }, battleRoomDefaultChatChannel);
  let chatChannels: { [channelName: string]: ChatChannel } = {};

  beforeEach(() => {
    chatChannels = {};
  });

  it("lets user join with multiple sockets and channel is deleted when no users are present", () => {
    // user joins, channel should be created and user added to the list
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta, null, battleRoomDefaultChatChannel);
    expect(chatChannels[battleRoomDefaultChatChannel]).toBeTruthy();
    expect(Object.keys(chatChannels[battleRoomDefaultChatChannel].connectedUsers).length).toBe(1);
    // user joins with second socket
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta2, null, battleRoomDefaultChatChannel);
    expect(chatChannels[battleRoomDefaultChatChannel]).toBeTruthy();
    expect(Object.keys(chatChannels[battleRoomDefaultChatChannel].connectedUsers).length).toBe(1);
    expect(chatChannels[battleRoomDefaultChatChannel].connectedUsers[TEST_USER_NAME].connectedSockets.length).toBe(2);
    // user disconnects their second socket
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta2, battleRoomDefaultChatChannel, null);
    expect(chatChannels[battleRoomDefaultChatChannel]).toBeTruthy();
    expect(chatChannels[battleRoomDefaultChatChannel].connectedUsers[TEST_USER_NAME].connectedSockets.length).toBe(1);
    // user disconnects their only remaining socket, they are the last person left so the channel should be deleted
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta, battleRoomDefaultChatChannel, null);
    expect(chatChannels[battleRoomDefaultChatChannel]).toBeUndefined();
    expect(Object.keys(chatChannels).length).toBe(0);
  });

  it("coerces channel names to kebab case and correctly updates chat channels when a user leaves one and joins another", () => {
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta, null, battleRoomDefaultChatChannel);
    updateChatChannelUsernameListsAndDeleteEmptyChannels(chatChannels, socketMeta, battleRoomDefaultChatChannel, defaultChatChannelNames.LURKER_LOUNGE);
    expect(chatChannels[defaultChatChannelNames.LURKER_LOUNGE]).toBeUndefined();
    expect(chatChannels[toKebabCase(defaultChatChannelNames.LURKER_LOUNGE)]).toBeTruthy();
  });
});
