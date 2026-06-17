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
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = card.title.toLowerCase().includes(q);
          const matchesDesc = card.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }
        if (priorityFilter !== 'All' && card.priority !== priorityFilter) {
          return false;
        }
        return true;
      });
  }, [column.cardIds, cards, searchQuery, priorityFilter]);

  return (
    <div className="flex flex-col bg-zinc-950 w-80 shrink-0 border-2 border-zinc-800 h-max pb-2 relative">
      <div className="absolute -top-[10px] -left-[10px] w-2 h-2 border-t-2 border-l-2 border-zinc-600" />
      <div className="absolute -top-[10px] -right-[10px] w-2 h-2 border-t-2 border-r-2 border-zinc-600" />
      
      <div className="p-3 border-b-2 border-zinc-800 flex justify-between items-center bg-zinc-900">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-zinc-950 text-lime-400 px-2 py-1 border-2 border-lime-400 focus:outline-none text-xs font-mono font-bold w-full uppercase"
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
              className="font-mono font-bold text-zinc-100 text-sm cursor-text hover:text-lime-400 transition-colors truncate uppercase tracking-widest"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to rename"
            >
              {column.title}
            </h3>
          )}
          <span className="flex items-center justify-center border border-zinc-700 bg-zinc-950 text-lime-400 text-[10px] font-mono font-bold w-6 h-6 shrink-0 ml-auto shadow-[2px_2px_0_0_#27272a]">
            {columnCards.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 p-2 min-h-[150px] transition-colors ${
          isOver ? 'bg-zinc-900/50' : ''
        }`}
      >
        <div className="flex flex-col gap-3">
          <SortableContext items={columnCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {columnCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </SortableContext>
        </div>
        
        {(!searchQuery && priorityFilter === 'All') && (
          <div className="mt-3 border-t-2 border-dashed border-zinc-800 pt-3">
            <AddCard columnId={column.id} />
          </div>
        )}
      </div>
    </div>
  );
}
