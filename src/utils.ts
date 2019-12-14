import { parse } from "query-string";

function parseMilliseconds(milliseconds: number): [number, number] {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const seconds = Math.round((milliseconds - minutes * 60 * 1000) / 1000);
  return [minutes, seconds];
}

export function formatTimeVerbose(milliseconds: number): string {
  const [minutes, seconds] = parseMilliseconds(milliseconds);
  const parts = [];
  if (minutes === 1) {
    parts.push("1 minute");
  } else if (minutes > 1) {
    parts.push(`${minutes} minutes`);
  }
  if (seconds === 1) {
    parts.push("1 second");
  } else if (seconds > 1) {
    parts.push(`${seconds} seconds`);
  }
  return parts.join(", ");
}

export function formatTime(milliseconds: number): string {
  const [minutes, seconds] = parseMilliseconds(milliseconds);
  const minutesStr = minutes >= 10 ? `${minutes}` : `0${minutes}`;
  const secondsStr = seconds >= 10 ? `${seconds}` : `0${seconds}`;
  return `${minutesStr}:${secondsStr}`;
}

export function getShareUrl(): string {
  const params = parse(window.location.search);
  return typeof params.shareUrl === "string"
    ? decodeURIComponent(params.shareUrl)
    : window.location.href;
}
