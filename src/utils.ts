import { parse } from "query-string";
import {
  PuzzleConfiguration,
  Dimensions,
  RawConfig,
  QueryParams
} from "./types";

const QUERY_PARAMS = parseQueryParams();

function parseQueryParams(): QueryParams {
  const params = parse(window.location.search, { parseBooleans: true });
  if (!(params.puzzle && typeof params.puzzle === "string")) {
    throw new Error("Puzzle not defined in the URL query string");
  }
  return {
    puzzle: params.puzzle,
    parentUrl:
      (typeof params.parentUrl === "string" && params.parentUrl) || undefined,
    devMode:
      (typeof params.devMode === "boolean" && params.devMode) || undefined
  };
}

export function getDevMode(): boolean {
  return !!QUERY_PARAMS.devMode;
}

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
  return typeof QUERY_PARAMS.parentUrl === "string"
    ? QUERY_PARAMS.parentUrl
    : window.location.href;
}

export function getConfigUrl(): string {
  return `puzzles/${QUERY_PARAMS.puzzle}.json`;
}

export function parseConfig(configuration: RawConfig): PuzzleConfiguration {
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

export function hypotenuse(a: number, b: number): number {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
