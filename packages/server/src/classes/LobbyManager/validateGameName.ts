export default function validateGameName(gameName: string) {
  const maxGameNameLength = 20;
  if (gameName.length < 1) return "Game name must be at least one character long";
  if (gameName.length > maxGameNameLength) return `Game name must be fewer than ${maxGameNameLength} characters`;
}
