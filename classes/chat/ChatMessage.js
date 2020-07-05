class ChatMessage {
  constructor({ author, style, messageText }) {
    this.author = author;
    this.style = style;
    this.messageText = messageText;
    this.timeStamp = Date.now();
  }
}
module.exports = ChatMessage;
