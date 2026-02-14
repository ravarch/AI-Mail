export interface Session {
  username: string;
  address: string;
  password?: string;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  has_attachments: boolean;
  is_read: boolean;
  ai_summary?: string;
  created_at: number; // Unix timestamp
}

export interface FullEmail extends Email {
  raw_content: string; // JSON string from R2
}

export type ViewState = 'login' | 'inbox';
