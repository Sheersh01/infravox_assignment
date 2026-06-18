"use client";
import { create } from 'zustand';
import { BoardData, Card, Priority, ActionType, Column } from '../types/board';
import { DEFAULT_BOARD_STATE } from '../constants/board';
import { generateId } from '../utils/generateId';
import { createLogEntry, appendLogEntry } from '../utils/activityLog';

// Create a singleton Tab ID for the current session
const TAB_ID = generateId();

interface BoardState extends BoardData {
  tabId: string;
  selectedCardId: string | null;
  searchQuery: string;
  priorityFilter: Priority | 'All';
  isInitialized: boolean;
  isDraggingLocally: boolean;
  inTransitCardIds: Record<string, string>; // cardId -> tabId mapping for cards currently being dragged
  
  // Actions
  initialize: (state: BoardData) => void;
  syncFromBroadcast: (state: BoardData) => void;
  setInTransitCard: (cardId: string, tabId: string, isDragging: boolean) => void;
  setIsDraggingLocally: (isDragging: boolean) => void;
  restoreColumns: (columns: Record<string, Column>) => void;
  
  // Board & Column Actions
  renameBoard: (title: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  
  // Card Actions
  addCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, sourceColId: string, destColId: string, newIndex: number) => void;
  
  // UI Actions
  selectCard: (cardId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: Priority | 'All') => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  ...DEFAULT_BOARD_STATE,
  tabId: TAB_ID,
  selectedCardId: null,
  searchQuery: '',
  priorityFilter: 'All',
  isInitialized: false,
  isDraggingLocally: false,
  inTransitCardIds: {},

  initialize: (state) => set({ ...state, isInitialized: true }),
  
  setIsDraggingLocally: (isDraggingLocally) => set({ isDraggingLocally }),
  restoreColumns: (columns) => set({ columns }),
  
  syncFromBroadcast: (state) => set({
    title: state.title,
    columns: state.columns,
    cards: state.cards,
    activityLog: state.activityLog,
  }),

  setInTransitCard: (cardId, tabId, isDragging) => set((state) => {
    const newInTransit = { ...state.inTransitCardIds };
    if (isDragging) {
      newInTransit[cardId] = tabId;
    } else {
      delete newInTransit[cardId];
    }
    return { inTransitCardIds: newInTransit };
  }),

  renameBoard: (title) => set((state) => {
    const newLog = appendLogEntry(state.activityLog, createLogEntry('Board Renamed', state.tabId, `to "${title}"`));
    return { title, activityLog: newLog };
  }),

  renameColumn: (columnId, title) => set((state) => {
    const column = state.columns[columnId];
    if (!column) return state;
    
    const newColumns = {
      ...state.columns,
      [columnId]: { ...column, title }
    };
    const newLog = appendLogEntry(state.activityLog, createLogEntry('Column Renamed', state.tabId, `to "${title}"`));
    
    return { columns: newColumns, activityLog: newLog };
  }),

  addCard: (columnId, title) => set((state) => {
    const column = state.columns[columnId];
    if (!column) return state;

    const newCard: Card = {
      id: generateId(),
      title,
      description: '',
      priority: 'Medium',
      dueDate: null,
      assignee: null,
      comments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newColumns = {
      ...state.columns,
      [columnId]: {
        ...column,
        cardIds: [...column.cardIds, newCard.id],
      }
    };

    const newLog = appendLogEntry(state.activityLog, {
        id: crypto.randomUUID(),
        action: 'Card Created',
        details: `"${title}" added to ${state.columns[columnId].title}`,
        timestamp: Date.now(),
        tabId: state.tabId,
    });

    return {
      cards: { ...state.cards, [newCard.id]: newCard },
      columns: newColumns,
      activityLog: newLog,
    };
  }),

  updateCard: (cardId, updates) => set((state) => {
    const card = state.cards[cardId];
    if (!card) return state;

    const updatedCard = {
      ...card,
      ...updates,
      updatedAt: Date.now(),
    };

    const newLog = appendLogEntry(state.activityLog, {
        id: crypto.randomUUID(),
        action: 'Card Updated',
        details: `"${updatedCard.title}" updated`,
        timestamp: Date.now(),
        tabId: state.tabId,
    });

    return {
      cards: { ...state.cards, [cardId]: updatedCard },
      activityLog: newLog,
    };
  }),

  deleteCard: (cardId) => set((state) => {
    const card = state.cards[cardId];
    if (!card) return state;

    const newCards = { ...state.cards };
    delete newCards[cardId];

    const newColumns: Record<string, Column> = {};
    for (const [colId, col] of Object.entries(state.columns)) {
      newColumns[colId] = {
        ...col,
        cardIds: col.cardIds.filter(id => id !== cardId),
      };
    }

    const newLog = appendLogEntry(state.activityLog, {
        id: crypto.randomUUID(),
        action: 'Card Deleted',
        details: `"${card.title}" deleted`,
        timestamp: Date.now(),
        tabId: state.tabId,
    });

    return {
      cards: newCards,
      columns: newColumns,
      activityLog: newLog,
      selectedCardId: state.selectedCardId === cardId ? null : state.selectedCardId,
    };
  }),

  moveCard: (cardId, sourceColId, destColId, newIndex) => set((state) => {
    const sourceCol = state.columns[sourceColId];
    const destCol = state.columns[destColId];
    if (!sourceCol || !destCol) return state;

    const newColumns = { ...state.columns };
    
    if (sourceColId === destColId) {
      // Reorder within the same column
      const newCardIds = Array.from(sourceCol.cardIds);
      const oldIndex = newCardIds.indexOf(cardId);
      newCardIds.splice(oldIndex, 1);
      newCardIds.splice(newIndex, 0, cardId);
      
      newColumns[sourceColId] = { ...sourceCol, cardIds: newCardIds };
    } else {
      // Move to a different column
      const sourceCardIds = Array.from(sourceCol.cardIds);
      const oldIndex = sourceCardIds.indexOf(cardId);
      if (oldIndex !== -1) {
        sourceCardIds.splice(oldIndex, 1);
      }
      
      const destCardIds = Array.from(destCol.cardIds);
      // Ensure we don't insert duplicates
      if (!destCardIds.includes(cardId)) {
        destCardIds.splice(newIndex, 0, cardId);
      }
      
      newColumns[sourceColId] = { ...sourceCol, cardIds: sourceCardIds };
      newColumns[destColId] = { ...destCol, cardIds: destCardIds };
    }

    const card = state.cards[cardId];
    const newLog = appendLogEntry(state.activityLog, {
      id: crypto.randomUUID(),
      action: 'Card Moved',
      details: `"${card?.title}" moved from ${sourceCol.title} to ${destCol.title}`,
      timestamp: Date.now(),
      tabId: state.tabId,
    });

    return { columns: newColumns, activityLog: newLog };
  }),

  selectCard: (cardId) => set({ selectedCardId: cardId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
}));
