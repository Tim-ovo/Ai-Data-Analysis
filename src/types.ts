export type View = 'dashboard' | 'projects' | 'chat' | 'settings' | 'help' | 'account';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Dataset {
  id: string;
  name: string;
  date: string;
  status: 'cleaned' | 'processing' | 'reading' | 'error';
  size: string;
  sizeBytes: number;
  progress?: number;
}

export interface ProfitableUser {
  name: string;
  profit: string;
  percentage: number;
}
