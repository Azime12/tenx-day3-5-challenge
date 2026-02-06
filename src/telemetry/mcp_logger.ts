export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  AUDIT = 'AUDIT' // Critical for financial safety
}

export interface TelemetryEvent {
  timestamp: string;
  level: LogLevel;
  source: string; // e.g., 'Planner', 'CFO-Judge'
  message: string;
  data?: Record<string, any>;
  agentId?: string;
}

export function logEvent(event: TelemetryEvent) {
  const logMessage = `[MCP-LOG] [${event.timestamp}] [${event.level}] [${event.source}] ${event.message}`;
  
  if (event.data) {
    console.log(logMessage, JSON.stringify(event.data));
  } else {
    console.log(logMessage);
  }

  // NOTE: In production, this would also push to a persistent telemetry sink via MCP
}

export function logAudit(source: string, message: string, data?: Record<string, any>) {
  logEvent({
    timestamp: new Date().toISOString(),
    level: LogLevel.AUDIT,
    source,
    message,
    data
  });
}
