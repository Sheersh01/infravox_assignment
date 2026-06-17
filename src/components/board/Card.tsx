import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { MessageSquare, TerminalSquare, Database, GripVertical } from 'lucide-react';

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
        className="bg-zinc-900 border-2 border-dashed border-lime-400 h-32 opacity-50 relative before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-lime-400"
      />
    );
  }

  const isSelected = selectedCardId === card.id;

  const priorityColors = {
    Low: 'text-cyan-500 border-cyan-500',
    Medium: 'text-amber-500 border-amber-500',
    High: 'text-red-500 border-red-500 shadow-[2px_2px_0_0_#ff3333]',
  };

  const isOverdue = card.dueDate ? new Date(card.dueDate).getTime() < Date.now() : false;

  if (inTransitTabId) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 opacity-40 grayscale pointer-events-none">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-sans font-bold text-zinc-500 line-through">{card.title}</h4>
          <span className="text-[10px] font-mono font-bold bg-lime-400 text-black px-1 uppercase tracking-widest">In_Transit</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectCard(card.id)}
      className={`bg-zinc-950 border-2 ${
        isSelected ? 'border-lime-400 shadow-[4px_4px_0_0_#ccff00]' : 'border-zinc-700 hover:border-zinc-500 hover:shadow-[4px_4px_0_0_#3f3f46]'
      } p-3 cursor-pointer group transition-all relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border uppercase tracking-widest ${priorityColors[card.priority]}`}>
            PR:{card.priority.substring(0, 3)}
          </span>
        </div>
        <div 
          {...attributes} 
          {...listeners} 
          className="text-zinc-600 hover:text-lime-400 cursor-grab active:cursor-grabbing p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <h4 className="text-sm font-sans font-bold text-zinc-100 mb-4 line-clamp-2 leading-tight">
        {card.title}
      </h4>

      <div className="flex items-center gap-3 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
        {card.description && (
          <div className="flex items-center gap-1" title="Has parameters">
            <Database className="w-3.5 h-3.5" />
          </div>
        )}
        {card.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-bold' : ''}`} title={`Deadline: ${card.dueDate}${isOverdue ? ' (BREACHED)' : ''}`}>
            <TerminalSquare className="w-3.5 h-3.5" />
            <span>{new Date(card.dueDate).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</span>
          </div>
        )}
        {(Array.isArray(card.comments) ? card.comments : []).length > 0 && (
          <div className="flex items-center gap-1" title={`${(Array.isArray(card.comments) ? card.comments : []).length} transmissions`}>
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{(Array.isArray(card.comments) ? card.comments : []).length}</span>
          </div>
        )}
        {card.assignee && (
          <div className="ml-auto text-lime-400 border border-lime-400/50 px-1 font-bold" title={`Assigned: ${card.assignee}`}>
            {card.assignee.substring(0, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
