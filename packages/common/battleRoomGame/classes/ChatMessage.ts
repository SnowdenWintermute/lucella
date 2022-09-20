export class ChatMessage {
  style: string;
  timeStamp: number;
  text: string;
  author: string;
  constructor(style: string, timeStamp: number, text: string, author: string) {
    this.style = style;
    this.timeStamp = timeStamp;
    this.text = text;
    this.author = author;
  }
}
