export enum ChatMessageStyles {
  PRIVATE = "private",
  NORMAL = "normal",
}

export class ChatMessage {
  text: string;
  timeStamp = +Date.now();
  author?: string;
  style?: ChatMessageStyles;
  constructor(text: string, author?: string, style?: ChatMessageStyles) {
    this.style = style || ChatMessageStyles.NORMAL;
    this.text = text;
    this.author = author;
  }
}
