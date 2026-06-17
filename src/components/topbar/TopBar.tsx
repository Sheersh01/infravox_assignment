import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useTabRegistry } from '../../hooks/useTabRegistry';
import { Search, Activity, SidebarClose, Terminal } from 'lucide-react';
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
    <div className="h-16 border-b-2 border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
      {/* Decorative top border highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-lime-400/0 via-lime-400/50 to-lime-400/0" />
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-lime-400 font-bold text-xl uppercase tracking-tighter">
          <Terminal className="w-6 h-6" />
          <span className="hidden sm:inline">K-Flow</span>
        </div>
        
        <div className="h-6 w-px bg-zinc-800" />

        {isEditing ? (
          <input
            autoFocus
            className="bg-zinc-900 text-lime-400 px-2 py-1 border-2 border-lime-400 focus:outline-none font-mono text-sm w-64"
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
            className="text-lg font-bold text-zinc-100 cursor-text hover:text-lime-400 transition-colors uppercase tracking-widest"
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-lime-400" />
          <input
            type="text"
            placeholder="SEARCH..."
            className="bg-zinc-900 text-xs font-mono text-zinc-200 pl-9 pr-4 py-2 border border-zinc-700 focus:outline-none focus:border-lime-400 w-64 transition-all uppercase placeholder-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="bg-zinc-900 text-xs font-mono text-zinc-200 px-3 py-2 border border-zinc-700 focus:outline-none focus:border-lime-400 appearance-none uppercase cursor-pointer"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
        >
          <option value="All">PRIORITY: ALL</option>
          <option value="High">PRIORITY: HIGH</option>
          <option value="Medium">PRIORITY: MED</option>
          <option value="Low">PRIORITY: LOW</option>
        </select>

        <div className="h-6 w-px bg-zinc-800" />

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-widest" title={`${activeTabCount} active tab(s)`}>
          <span>Nodes</span>
          <Badge variant={activeTabCount > 1 ? 'success' : 'default'}>
            {activeTabCount.toString().padStart(2, '0')}
          </Badge>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleSidebar} title="Toggle Logs">
          {isSidebarOpen ? <SidebarClose className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
