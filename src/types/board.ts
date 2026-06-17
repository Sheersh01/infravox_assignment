export type Priority = 'Low' | 'Medium' | 'High';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null; // ISO string
  assignee: string | null;
  comments: { id: string; text: string; timestamp: number; author: string }[];
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export type ActionType = 
  | 'Card Created'
  | 'Card Updated'
  | 'Card Deleted'
  | 'Card Moved'
  | 'Column Renamed'
  | 'Board Renamed';

export interface ActivityLogEntry {
  id: string;
  action: ActionType;
  details?: string;
  timestamp: number;
  tabId: string;
}

export interface BoardData {
  title: string;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  activityLog: ActivityLogEntry[];
}
