import { BoardData } from '../types/board';

export const DEFAULT_BOARD_STATE: BoardData = {
  title: 'My Project Board',
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', cardIds: [] },
    'col-2': { id: 'col-2', title: 'In Progress', cardIds: [] },
    'col-3': { id: 'col-3', title: 'In Review', cardIds: [] },
    'col-4': { id: 'col-4', title: 'Done', cardIds: [] },
  },
  cards: {},
  activityLog: [],
};

// We store column order here instead of inside BoardData to keep it simpler if we only have fixed columns, 
// but to support future drag/drop of columns, we can add a columnOrder array to BoardData. 
// For now, we'll hardcode the order for simplicity.
export const DEFAULT_COLUMN_ORDER = ['col-1', 'col-2', 'col-3', 'col-4'];

export const STORAGE_KEY = 'kanbanflow-board-state';
export const SYNC_CHANNEL_NAME = 'kanbanflow-sync';
