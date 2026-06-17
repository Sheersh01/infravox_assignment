import React, { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { Card } from './Card';
import { AddCard } from './AddCard';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const cards = useBoardStore((state) => state.cards);
  const renameColumn = useBoardStore((state) => state.renameColumn);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const priorityFilter = useBoardStore((state) => state.priorityFilter);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const handleTitleSubmit = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      renameColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const columnCards = useMemo(() => {
    return column.cardIds
      .map((id) => cards[id])
      .filter(Boolean)
      .filter((card) => {
        // Search filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = card.title.toLowerCase().includes(q);
          const matchesDesc = card.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }
        // Priority filter
        if (priorityFilter !== 'All' && card.priority !== priorityFilter) {
          return false;
        }
        return true;
      });
  }, [column.cardIds, cards, searchQuery, priorityFilter]);

  return (
    <div className="flex flex-col bg-slate-900 rounded-xl w-80 shrink-0 border border-slate-800 shadow-sm h-max pb-2">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-slate-800 text-slate-100 px-2 py-1 rounded border border-blue-500 focus:outline-none text-sm font-semibold w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setEditTitle(column.title);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <h3 
              className="font-semibold text-slate-200 text-sm cursor-text hover:text-white transition-colors truncate"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to rename"
            >
              {column.title}
            </h3>
          )}
          <span className="flex items-center justify-center bg-slate-800 text-slate-400 text-xs font-medium rounded-full w-6 h-6 shrink-0 ml-auto">
            {columnCards.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 p-2 min-h-[150px] transition-colors ${
          isOver ? 'bg-slate-800/30' : ''
        }`}
      >
        <div className="flex flex-col gap-2">
          <SortableContext items={columnCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {columnCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </SortableContext>
        </div>
        
        {(!searchQuery && priorityFilter === 'All') && (
          <AddCard columnId={column.id} />
        )}
      </div>
    </div>
  );
}
