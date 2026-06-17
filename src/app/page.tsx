"use client";

import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBroadcast } from '../hooks/useBroadcast';
import { Board } from '../components/board/Board';
import { TopBar } from '../components/topbar/TopBar';
import { ActivityLog } from '../components/sidebar/ActivityLog';
import { EditPanel } from '../components/sidebar/EditPanel';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isLoaded, saveState, loadState } = useLocalStorage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const state = useBoardStore((state) => state);
  const { tabId, isInitialized, initialize, syncFromBroadcast, selectedCardId, setInTransitCard } = state;

  const { broadcastState, broadcastDragState } = useBroadcast(
    tabId, 
    (incomingState) => {
      syncFromBroadcast(incomingState);
    },
    (cardId, incomingTabId, isDragging) => {
      setInTransitCard(cardId, incomingTabId, isDragging);
    }
  );

  // Initialize from LocalStorage
  useEffect(() => {
    if (isLoaded && !isInitialized) {
      const savedData = loadState();
      initialize(savedData);
    }
  }, [isLoaded, isInitialized, loadState, initialize]);

  // Save to LocalStorage and Broadcast when state changes
  useEffect(() => {
    if (isInitialized) {
      const dataToSaveAndSync = {
        title: state.title,
        columns: state.columns,
        cards: state.cards,
        activityLog: state.activityLog,
      };
      
      saveState(dataToSaveAndSync);
      broadcastState(dataToSaveAndSync);
    }
  }, [state.title, state.columns, state.cards, state.activityLog, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent text-indigo-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden text-zinc-900"
      style={{
        backgroundColor: '#f4f4f5',
        backgroundImage: 'radial-gradient(#d1d5db 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      
      {/* The Infinite Canvas */}
      <div className="absolute inset-0 z-0">
        <Board broadcastDragState={broadcastDragState} />
      </div>

      {/* Floating UI Layer */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
          <TopBar 
            isSidebarOpen={isSidebarOpen} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        </div>

        {/* Right side floating stack */}
        <div className="pointer-events-auto flex flex-col gap-4 items-end max-w-sm w-full">
          {/* We will move the right-side controls into TopBar or keep them separate. 
              Actually, TopBar currently renders the whole bar. Let's let TopBar handle the left/right split. */}
        </div>
      </div>

      {/* Floating Sidebar (Activity / Edit Panel) */}
      {(isSidebarOpen || selectedCardId) && (
        <div className="absolute top-20 right-4 bottom-4 w-80 z-20 pointer-events-auto flex flex-col gap-4">
          {selectedCardId ? (
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
              <EditPanel cardId={selectedCardId} />
            </div>
          ) : isSidebarOpen ? (
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
              <ActivityLog />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
