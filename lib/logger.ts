export type LogLevel = "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;
export type LogSink = (line: string) => void;

const sensitiveKey = /(authorization|password|cookie|token|secret|signature|card|bank|email|address|invoice(url|body|note|description)?)/i;

export function redact(value: unknown, key?: string): unknown {
  if (key && sensitiveKey.test(key)) return "[REDACTED]";
  if (Array.isArray(value)) return value.map(item => redact(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, redact(entryValue, entryKey)]));
  }
  return value;
}

export function createLogger(sink: LogSink = line => globalThis.console.log(line)) {
  return (level: LogLevel, message: string, context: LogContext = {}) => {
    const safeContext = redact(context) as LogContext;
    sink(JSON.stringify({ level, message, ...safeContext, timestamp: new Date().toISOString() }));
  };
}
