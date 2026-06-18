"use client";
import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useTabRegistry } from '../../hooks/useTabRegistry';
import { Search, Activity, SidebarClose, Layers } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function TopBar({ onToggleSidebar, isSidebarOpen }: TopBarProps) {
  const { title, renameBoard, tabId, searchQuery, setSearchQuery, priorityFilter, setPriorityFilter } = useBoardStore();
  const { activeTabCount } = useTabRegistry(tabId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleTitleSubmit = () => {
    if (editTitle.trim() && editTitle !== title) {
      renameBoard(editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-start w-[calc(100vw-32px)]">
      {/* Left Floating Panel: Title & Branding */}
      <div className="bg-white rounded-2xl shadow-md border border-zinc-200 px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2 text-indigo-500 font-bold">
          <div className="bg-indigo-100 p-1.5 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        
        <div className="h-6 w-px bg-zinc-200" />

        {isEditing ? (
          <input
            autoFocus
            className="bg-zinc-50 text-zinc-900 px-2 py-1 rounded-md border-2 border-indigo-500 focus:outline-none text-sm font-semibold w-48"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setEditTitle(title);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <h1 
            className="text-sm font-bold text-zinc-800 cursor-text hover:text-indigo-500 transition-colors"
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
          >
            {title}
          </h1>
        )}
      </div>

      {/* Right Floating Panel: Controls */}
      <div className="bg-white rounded-2xl shadow-md border border-zinc-200 px-2 py-2 flex items-center gap-2">
        <div className="relative group hidden md:block px-2">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Search board..."
            className="bg-zinc-50 text-sm text-zinc-800 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-48 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="bg-zinc-50 text-sm text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer outline-none"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div className="h-6 w-px bg-zinc-200 mx-1" />

        <div className="flex items-center gap-1.5 px-2" title={`${activeTabCount} active collaborator(s)`}>
          <div className="relative flex -space-x-2">
            {[...Array(Math.min(activeTabCount, 3))].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">
                {i === 2 && activeTabCount > 3 ? `+${activeTabCount - 2}` : 'U'}
              </div>
            ))}
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleSidebar} title="Toggle Activity Log" className="rounded-xl ml-1">
          {isSidebarOpen ? <SidebarClose className="w-5 h-5 text-zinc-600" /> : <Activity className="w-5 h-5 text-zinc-600" />}
        </Button>
      </div>
    </div>
  );
}
