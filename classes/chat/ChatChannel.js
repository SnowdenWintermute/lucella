class ChatChannel {
  constructor({ name, parentGameRoom }) {
    this.name = name;
    this.parentGameRoom = parentGameRoom;
    this.messageHistory = [];
  }
}

module.exports = ChatChannel;
