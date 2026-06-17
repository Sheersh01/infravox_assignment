import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';
import { Badge } from '../ui/Badge';
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
        className="bg-slate-800/50 border-2 border-dashed border-blue-500/50 rounded-lg h-32 opacity-50"
      />
    );
  }

  const isSelected = selectedCardId === card.id;

  const priorityColors = {
    Low: 'bg-slate-700 text-slate-300',
    Medium: 'bg-amber-500/20 text-amber-400',
    High: 'bg-red-500/20 text-red-400',
  };

  const isOverdue = card.dueDate ? new Date(card.dueDate).getTime() < Date.now() : false;

  if (inTransitTabId) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 shadow-sm opacity-60">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-400">{card.title}</h4>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">In Transit</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectCard(card.id)}
      className={`bg-slate-800 rounded-lg border ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-700 hover:border-slate-600'
      } p-3 cursor-pointer shadow-sm group transition-all`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityColors[card.priority]}`}>
            {card.priority}
          </span>
        </div>
        <div 
          {...attributes} 
          {...listeners} 
          className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <h4 className="text-sm font-medium text-slate-100 mb-2 line-clamp-2 leading-tight">
        {card.title}
      </h4>

      <div className="flex items-center gap-3 text-slate-400 mt-3 text-xs">
        {card.description && (
          <div className="flex items-center gap-1" title="Has description">
            <AlignLeft className="w-3.5 h-3.5" />
          </div>
        )}
        {card.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`} title={`Due: ${card.dueDate}${isOverdue ? ' (Overdue)' : ''}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        {card.comments.length > 0 && (
          <div className="flex items-center gap-1" title={`${card.comments.length} comments`}>
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{card.comments.length}</span>
          </div>
        )}
        {card.assignee && (
          <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-300" title={`Assigned to ${card.assignee}`}>
            {card.assignee.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
