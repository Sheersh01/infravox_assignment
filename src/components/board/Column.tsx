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
    <div className="flex flex-col w-80 shrink-0 h-max pb-2 relative bg-zinc-50 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="px-3 py-3 flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <input
              autoFocus
              className="bg-white text-zinc-900 px-2 py-1 rounded-md border-2 border-indigo-500 focus:outline-none text-base font-bold w-full shadow-sm"
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
              className="font-bold text-zinc-800 text-base cursor-text hover:text-indigo-600 transition-colors truncate"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to rename"
            >
              {column.title}
            </h3>
          )}
          <span className="flex items-center justify-center bg-zinc-200 text-zinc-600 text-xs font-bold rounded-full w-6 h-6 shrink-0 ml-auto">
            {columnCards.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 min-h-[150px] transition-colors rounded-2xl px-2 ${
          isOver ? 'bg-zinc-200/50' : ''
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
          <div className="mt-3 pt-2">
            <AddCard columnId={column.id} />
          </div>
        )}
      </div>
    </div>
  );
}
