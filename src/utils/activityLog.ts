import { ActivityLogEntry, ActionType } from '../types/board';
import { generateId } from './generateId';

export function createLogEntry(
  action: ActionType,
  tabId: string,
  details?: string
): ActivityLogEntry {
  return {
    id: generateId(),
    action,
    details,
    timestamp: Date.now(),
    tabId,
  };
}

export function appendLogEntry(
  currentLog: ActivityLogEntry[],
  newEntry: ActivityLogEntry
): ActivityLogEntry[] {
  // Keep only the last 20 actions
  const newLog = [newEntry, ...currentLog];
  if (newLog.length > 20) {
    return newLog.slice(0, 20);
  }
  return newLog;
}
