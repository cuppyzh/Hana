import { basename } from "jsr:@std/path@0.217/basename";
import { Logger } from "jsr:@deno-library/logger";

class CustomLogging {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.logger.initFileLogger(`./data/logs`, {
      rotate: true,
    });
  }

  Info(...args: unknown[]) {
    this.logger.info(getCallerMessage(), args);
  }

  Error(...args: unknown[]) {
    this.logger.error(getCallerMessage(), args);
  }
}

function getCallerMessage() {
  const stack = new Error().stack;

  const callerLine = stack?.split("\n")[3];
  const fullPath = callerLine?.match(/(\S+):\d+:\d+/)?.[1];
  const filename = fullPath ? basename(fullPath) : undefined;
  const methodName = callerLine?.match(/at\s+(.*)\s+\(/)?.[1];
  const lineNumberMatch = callerLine?.match(/:(\d+):\d+/);
  const lineNumber = lineNumberMatch ? lineNumberMatch[1] : undefined;

  let callerMessage = `[${filename}:${lineNumber}]`;

  if (methodName) {
    callerMessage = `[${filename}.${methodName}:${lineNumber}]`;
  }
  return callerMessage;
}

export const Log = new CustomLogging();
