import { parse } from "query-string";
import configuration from "../src/districts/wv.json";
import { PuzzleConfiguration, Dimensions } from "./types";

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
    parts.push(`${minutes || 0} minutes`);
  }
  if (seconds === 1) {
    parts.push("1 second");
  } else if (seconds > 1) {
    parts.push(`${seconds || 0} seconds`);
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
  return typeof params.parentUrl === "string"
    ? decodeURIComponent(params.parentUrl)
    : window.location.href;
}

export function getData(): PuzzleConfiguration {
  return {
    viewBox: [
      configuration.viewBox.minX,
      configuration.viewBox.minY,
      configuration.viewBox.width,
      configuration.viewBox.height
    ],
    pieces: Object.entries(configuration.paths).map(([key, paths]) => {
      const [x, y] = configuration.transforms[key] || ["0", "0"];
      return {
        key,
        paths,
        transform: [parseFloat(x), parseFloat(y)]
      };
    }),
    title: configuration.title,
    shareText: configuration.shareText
  };
}

export function millisecondsSince(date: Date): number {
  return Math.round(new Date().getTime() - date.getTime());
}

export function constrainToAspectRatio(
  { width, height }: Dimensions,
  aspectRatio: number
): Dimensions {
  const ratio = width / height;

  if (ratio > aspectRatio) {
    // too wide
    return {
      height,
      width: height * aspectRatio
    };
  } else if (ratio < aspectRatio) {
    return {
      height: width / aspectRatio,
      width
    };
  } else {
    return { width, height };
  }
}
