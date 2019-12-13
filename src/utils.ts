export function formatTime(milliseconds: number): string {
  return new Date(milliseconds).toISOString().substr(14, 5);
}
