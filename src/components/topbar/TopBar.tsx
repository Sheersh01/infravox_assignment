import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useTabRegistry } from '../../hooks/useTabRegistry';
import { Search, Users, Activity, SidebarClose, LayoutPanelLeft } from 'lucide-react';
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
    <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
          <LayoutPanelLeft className="w-6 h-6" />
          <span className="hidden sm:inline">KanbanFlow</span>
        </div>
        
        <div className="h-6 w-px bg-slate-800" />

        {isEditing ? (
          <input
            autoFocus
            className="bg-slate-800 text-slate-100 px-3 py-1 rounded border border-blue-500 focus:outline-none"
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
            className="text-lg font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors"
            onClick={() => setIsEditing(true)}
            title="Click to rename"
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400" />
          <input
            type="text"
            placeholder="Search cards..."
            className="bg-slate-800 text-sm text-slate-200 pl-9 pr-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-blue-500 w-64 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="bg-slate-800 text-sm text-slate-200 px-3 py-2 rounded border border-slate-700 focus:outline-none focus:border-blue-500 appearance-none"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-2" title={`${activeTabCount} active tab(s)`}>
          <Users className="w-5 h-5 text-slate-400" />
          <Badge variant={activeTabCount > 1 ? 'success' : 'default'}>
            {activeTabCount}
          </Badge>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleSidebar} title="Toggle Sidebar">
          {isSidebarOpen ? <SidebarClose className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
