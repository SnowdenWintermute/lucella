export class Ban {
  type: string;
  duration: number | null;
  constructor(type: "ACCOUNT" | "IP", duration?: number) {
    this.type = type;
    this.duration = duration || null;
  }
}
