import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'debug';
  service: string;
  type: string;
  data: any;
}

class JSONLogger {
  private logFile: string;
  private service: string;

  constructor(service: string, logDir: string = './logs') {
    this.service = service;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logFile = path.join(logDir, `${service}.json`);
    
    // Initialize with empty array if file doesn't exist
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '[]', 'utf8');
    }
  }

  private writeLog(entry: LogEntry) {
    try {
      const logs = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      logs.push(entry);
      
      // Keep only last 1000 entries to prevent file from growing too large
      if (logs.length > 1000) {
        logs.shift();
      }
      
      fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  info(type: string, data: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      service: this.service,
      type,
      data
    });
  }

  error(type: string, data: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      service: this.service,
      type,
      data
    });
  }

  debug(type: string, data: any) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      service: this.service,
      type,
      data
    });
  }
}

export default JSONLogger;

