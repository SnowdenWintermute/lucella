export function lagGenerator(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
