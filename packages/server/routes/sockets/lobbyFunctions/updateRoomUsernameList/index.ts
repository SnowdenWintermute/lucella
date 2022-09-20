import userLeavingRoom from "./userLeavingRoom";
import userJoiningRoom from "./userJoiningRoom";

export default function ({ application, nameOfChatChannelToLeave, nameOfchatChannelToJoin }) {
  if (nameOfChatChannelToLeave) userLeavingRoom({ application, nameOfChatChannelToLeave });
  if (nameOfchatChannelToJoin) userJoiningRoom({ application, nameOfchatChannelToJoin });
}
