type LogEntry = {
  requestId: string;
  method: string;
  path: string;
  status: number;
  duration: string;
  timestamp: string;
  userId?: string;
  ip?: string;
};

export function logRequest(entry: LogEntry): void {
  console.log(JSON.stringify(entry,null, 2));
}
