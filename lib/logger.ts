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

type Info = string | object;
export function logRequest(entry: LogEntry): void {
  console.log(
    `\x1b[32mRequest entry log\x1b[0m :  ${JSON.stringify(entry, null, 2)} ${endLine()}`,
  );
}

export function logInfo(info: any): void {
  console.log(
    `\n \x1b[33mLog\x1b[0m : ${JSON.stringify(info, null, 2)} ${endLine()}`,
  );
}

export function logError(info: Info): void {
  console.log(
    `\n \x1b[31mError\x1b[0m : ${JSON.stringify(info, null, 2)} ${endLine()}`,
  );
}

function endLine() {
  return `\n \x1b[97m___________________________________________\x1b[0m`;
}
