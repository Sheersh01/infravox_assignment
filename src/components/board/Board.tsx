'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  DragCancelEvent,
  pointerWithin,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '../../store/boardStore';
import { Column } from './Column';
import { Card as CardComponent } from './Card';
import { DEFAULT_COLUMN_ORDER } from '../../constants/board';
import { Card, Column as ColumnType } from '../../types/board';

export function Board({ broadcastDragState }: { broadcastDragState?: (cardId: string, isDragging: boolean) => void }) {
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const setIsDraggingLocally = useBoardStore((state) => state.setIsDraggingLocally);
  const restoreColumns = useBoardStore((state) => state.restoreColumns);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const priorityFilter = useBoardStore((state) => state.priorityFilter);

  const [localColumns, setLocalColumns] = useState(columns);

  // Sync local columns with global state when NOT dragging locally
  const isDraggingLocally = useBoardStore((state) => state.isDraggingLocally);
  useEffect(() => {
    if (!isDraggingLocally) {
      setLocalColumns(columns);
    }
  }, [columns, isDraggingLocally]);

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const originalColumns = useRef<Record<string, ColumnType> | null>(null);

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
      setIsDraggingLocally(true);
      originalColumns.current = JSON.parse(JSON.stringify(useBoardStore.getState().columns));
      if (broadcastDragState) broadcastDragState(active.id as string, true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    const isOverCard = over.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveCard) return;

    // Use localColumns for optimistic updates
    const freshColumns = localColumns;

    const sourceColId = Object.keys(freshColumns).find(colId => freshColumns[colId].cardIds.includes(activeId));
    if (!sourceColId) return;

    let destColId = '';
    let newIndex = 0;

    if (isOverColumn) {
      destColId = overId;
      if (sourceColId === destColId) return; // Don't do anything if hovering over same column's empty space
      newIndex = freshColumns[destColId].cardIds.length;
    } else if (isOverCard) {
      destColId = Object.keys(freshColumns).find(colId => freshColumns[colId].cardIds.includes(overId)) || '';
      if (!destColId) return;
      if (sourceColId === destColId) return; // Reordering within same column handled in DragEnd

      const destCardIds = freshColumns[destColId].cardIds;
      const overIndex = destCardIds.indexOf(overId);
      
      const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height / 2;
      const modifier = isBelowOverItem ? 1 : 0;
      newIndex = overIndex >= 0 ? overIndex + modifier : destCardIds.length;
    }

    if (destColId && sourceColId !== destColId) {
      // Optimistically update local state ONLY
      setLocalColumns((prev) => {
        const next = { ...prev };
        const sourceCardIds = Array.from(next[sourceColId].cardIds);
        const oldIndex = sourceCardIds.indexOf(activeId);
        if (oldIndex !== -1) sourceCardIds.splice(oldIndex, 1);
        
        const destCardIds = Array.from(next[destColId].cardIds);
        if (!destCardIds.includes(activeId)) {
          destCardIds.splice(newIndex, 0, activeId);
        }
        
        next[sourceColId] = { ...next[sourceColId], cardIds: sourceCardIds };
        next[destColId] = { ...next[destColId], cardIds: destCardIds };
        return next;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    
    if (active.data.current?.type === 'Card' && broadcastDragState) {
      broadcastDragState(active.id as string, false);
    }

    if (!over) {
      setIsDraggingLocally(false);
      setLocalColumns(columns); // Revert on failure
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const isActiveCard = active.data.current?.type === 'Card';
    if (!isActiveCard) return;

    // We calculate final destination based on the optimistic localColumns
    const freshColumns = localColumns;

    // Find source column (from global Zustand to issue the correct global move command)
    const originalSourceColId = Object.keys(columns).find(colId => columns[colId].cardIds.includes(activeId));
    if (!originalSourceColId) return;

    // Find dest column
    const isOverColumn = over.data.current?.type === 'Column';
    let destColId = '';
    let newIndex = 0;

    if (isOverColumn) {
      destColId = overId;
      newIndex = freshColumns[destColId].cardIds.length;
    } else {
      destColId = Object.keys(freshColumns).find(colId => freshColumns[colId].cardIds.includes(overId)) || '';
      if (destColId) {
        const destCardIds = freshColumns[destColId].cardIds;
        const overIndex = destCardIds.indexOf(overId);
        // If moving down within same column, index is tricky. arrayMove handles it well, 
        // but since we are doing custom state:
        if (originalSourceColId === destColId) {
           newIndex = overIndex;
        } else {
          // Inserting into a new column before the over item
          const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : destCardIds.length + 1;
        }
      }
    }

    if (destColId) {
      moveCard(activeId, originalSourceColId, destColId, newIndex);
    }
    
    setIsDraggingLocally(false);
  };

  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveCard(null);
    setLocalColumns(columns);
    setIsDraggingLocally(false);
    if (event.active.data.current?.type === 'Card' && broadcastDragState) {
      broadcastDragState(event.active.id as string, false);
    }
  };

  const isFiltering = searchQuery || priorityFilter !== 'All';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex px-8 pt-24 pb-8 gap-8 overflow-auto bg-transparent items-stretch h-full w-full">
        {DEFAULT_COLUMN_ORDER.map((colId) => {
          const col = localColumns[colId];
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
