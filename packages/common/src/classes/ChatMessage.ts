export class ChatMessage {
  author: string;
  text: string;
  style: string;
  timeStamp: number;
  constructor(author: string, text: string, style: string) {
    this.style = style;
    this.timeStamp = +Date.now();
    this.text = text;
    this.author = author;
  }
}

export enum ChatMessageStyles {
  PRIVATE = "private",
}
