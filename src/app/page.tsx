'use client';

import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBroadcast } from '../hooks/useBroadcast';
import { TopBar } from '../components/topbar/TopBar';
import { Board } from '../components/board/Board';
import { EditPanel } from '../components/sidebar/EditPanel';
import { ActivityLog } from '../components/sidebar/ActivityLog';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isLoaded, loadState, saveState } = useLocalStorage();
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
      const initialState = loadState();
      initialize(initialState);
    }
  }, [isLoaded, isInitialized, loadState, initialize]);

  // Save to LocalStorage and Broadcast on State Change
  useEffect(() => {
    if (isInitialized) {
      // Exclude ephemeral state from being persisted/broadcasted
      const { title, columns, cards, activityLog } = state;
      const dataToSaveAndSync = { title, columns, cards, activityLog };
      
      saveState(dataToSaveAndSync);
      broadcastState(dataToSaveAndSync);
    }
  }, [state.title, state.columns, state.cards, state.activityLog, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden text-slate-100">
      <TopBar 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex flex-1 overflow-auto">
        <main className="flex-1 min-w-0 relative">
          <Board broadcastDragState={broadcastDragState} />
        </main>
        
        {/* Sidebar for Activity Log and optionally Edit Panel */}
        {isSidebarOpen && !selectedCardId && (
          <aside className="w-80 shrink-0 border-l border-slate-800 bg-slate-900 overflow-y-auto">
            <ActivityLog />
          </aside>
        )}
        
        {/* Persistent Edit Panel */}
        {selectedCardId && (
          <aside className="w-80 shrink-0 border-l border-slate-800 bg-slate-900 overflow-hidden flex flex-col shadow-2xl z-20">
            <EditPanel cardId={selectedCardId} />
          </aside>
        )}
      </div>
    </div>
  );
}
