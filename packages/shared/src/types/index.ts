export enum UserRole {
  CONSUMER = 'CONSUMER',
  BROKER = 'BROKER',
  ADMIN = 'ADMIN',
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  version: string;
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export * from './insurtech';
