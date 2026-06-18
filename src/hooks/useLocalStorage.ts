"use client";
import { useState, useEffect, useCallback } from 'react';
import { BoardData } from '../types/board';
import { DEFAULT_BOARD_STATE, STORAGE_KEY } from '../constants/board';
import { debounce } from '../utils/debounce';

const saveToLocalStorage = debounce((state: BoardData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save board state to localStorage', error);
  }
}, 250);

export function useLocalStorage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadState = (): BoardData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as BoardData;
      }
    } catch (error) {
      console.error('Failed to parse board state from localStorage', error);
    }
    return DEFAULT_BOARD_STATE;
  };

  const saveState = useCallback((state: BoardData) => {
    saveToLocalStorage(state);
  }, []);

  useEffect(() => {
    // Initial load is synchronous in terms of signaling, but we mark it as loaded
    setIsLoaded(true);
  }, []);

  return { isLoaded, loadState, saveState };
}
