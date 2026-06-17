'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '../../store/boardStore';
import { Column } from './Column';
import { Card as CardComponent } from './Card';
import { DEFAULT_COLUMN_ORDER } from '../../constants/board';
import { Card } from '../../types/board';

export function Board({ broadcastDragState }: { broadcastDragState?: (cardId: string, isDragging: boolean) => void }) {
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const priorityFilter = useBoardStore((state) => state.priorityFilter);

  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Card') {
      setActiveCard(active.data.current.card);
      if (broadcastDragState) broadcastDragState(active.id as string, true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    const isOverCard = over.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveCard) return;

    // Moving card over another card or column requires optimistic state updates in a real app,
    // but with Zustand we can just rely on dragEnd for the final state change if it's within same container.
    // For inter-column moves, dnd-kit usually prefers handling in dragOver to give visual feedback.
    // To keep it simple and robust, we'll handle the actual state change in DragEnd.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    
    if (active.data.current?.type === 'Card' && broadcastDragState) {
      broadcastDragState(active.id as string, false);
    }

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isActiveCard = active.data.current?.type === 'Card';
    if (!isActiveCard) return;

    // Find source column
    const sourceColId = Object.keys(columns).find(colId => columns[colId].cardIds.includes(activeId));
    if (!sourceColId) return;

    // Find dest column
    const isOverColumn = over.data.current?.type === 'Column';
    let destColId = '';
    let newIndex = 0;

    if (isOverColumn) {
      destColId = overId;
      newIndex = columns[destColId].cardIds.length;
    } else {
      destColId = Object.keys(columns).find(colId => columns[colId].cardIds.includes(overId)) || '';
      if (destColId) {
        const destCardIds = columns[destColId].cardIds;
        const overIndex = destCardIds.indexOf(overId);
        // If moving down within same column, index is tricky. arrayMove handles it well, 
        // but since we are doing custom state:
        if (sourceColId === destColId) {
           newIndex = overIndex;
        } else {
          // Inserting into a new column before the over item
          const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : destCardIds.length + 1;
        }
      }
    }

    if (destColId && (sourceColId !== destColId || activeId !== overId)) {
      moveCard(activeId, sourceColId, destColId, newIndex);
    }
  };

  const isFiltering = searchQuery || priorityFilter !== 'All';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex p-6 gap-6 overflow-auto bg-transparent pb-8 items-start min-h-full">
        {DEFAULT_COLUMN_ORDER.map((colId) => {
          const col = columns[colId];
          if (!col) return null;
          return <Column key={col.id} column={col} />;
        })}
      </div>

      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
        {activeCard ? <CardComponent card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
