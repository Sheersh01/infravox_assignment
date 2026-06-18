"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { MessageSquare, Calendar, AlignLeft, GripVertical } from 'lucide-react';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const selectedCardId = useBoardStore((state) => state.selectedCardId);
  const selectCard = useBoardStore((state) => state.selectCard);
  const inTransitTabId = useBoardStore((state) => state.inTransitCardIds[card.id]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl h-32 opacity-50"
      />
    );
  }

  const isSelected = selectedCardId === card.id;

  // Miro-style colored sticky headers for priority
  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-amber-100 text-amber-800',
    High: 'bg-red-100 text-red-800',
  };

  const prioritySticker = {
    Low: 'bg-blue-400',
    Medium: 'bg-amber-400',
    High: 'bg-red-400',
  };

  const isOverdue = card.dueDate ? new Date(card.dueDate).getTime() < Date.now() : false;

  if (inTransitTabId) {
    return (
      <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm opacity-50 pointer-events-none scale-95 transition-all">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-500 line-through">{card.title}</h4>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Moving</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectCard(card.id)}
      className={`bg-white rounded-xl shadow-sm border ${
        isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
      } cursor-pointer group transition-all relative overflow-hidden`}
    >
      {/* Top color bar indicating priority */}
      <div className={`h-1.5 w-full ${prioritySticker[card.priority]}`} />
      
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${priorityColors[card.priority]} text-zinc-800`}>
              {card.priority}
            </span>
          </div>
          <div 
            {...attributes} 
            {...listeners} 
            className="text-zinc-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        <h4 className="text-sm font-bold text-zinc-900 mb-3 line-clamp-2 leading-snug">
          {card.title}
        </h4>

        <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium">
          {card.description && (
            <div className="flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" />
            </div>
          )}
          {card.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-md' : ''}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {(Array.isArray(card.comments) ? card.comments : []).length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{(Array.isArray(card.comments) ? card.comments : []).length}</span>
            </div>
          )}
          {card.assignee && (
            <div className="ml-auto bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold" title={`Assigned: ${card.assignee}`}>
              {card.assignee.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
