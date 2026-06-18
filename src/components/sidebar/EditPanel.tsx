"use client";
import React, { useState, useEffect } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../ui/Button';
import { ConfirmPrompt } from '../ui/ConfirmPrompt';
import { X, Trash2, Edit3, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';

interface EditPanelProps {
  cardId: string;
}

export function EditPanel({ cardId }: EditPanelProps) {
  const card = useBoardStore((state) => state.cards[cardId]);
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const selectCard = useBoardStore((state) => state.selectCard);

  const [newComment, setNewComment] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!card) return null;

  const handleDelete = () => {
    deleteCard(cardId);
    setIsConfirmOpen(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentObj = {
        id: Math.random().toString(36).substring(2, 9),
        text: newComment.trim(),
        timestamp: Date.now(),
        author: 'Guest',
      };
      updateCard(cardId, {
        comments: [...(Array.isArray(card.comments) ? card.comments : []), commentObj],
      });
      setNewComment('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-zinc-800">Edit Card</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmOpen(true)} title="Delete Card">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => selectCard(null)}>
            <X className="w-5 h-5 text-zinc-500" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
          <input
            type="text"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={card.title}
            onChange={(e) => updateCard(cardId, { title: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
          <textarea
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all h-28 resize-none"
            value={card.description || ''}
            onChange={(e) => updateCard(cardId, { description: e.target.value })}
            placeholder="Add details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</label>
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              value={card.priority}
              onChange={(e) => updateCard(cardId, { priority: e.target.value as any })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                value={card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => updateCard(cardId, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assignee</label>
          <input
            type="text"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={card.assignee || ''}
            onChange={(e) => updateCard(cardId, { assignee: e.target.value })}
            placeholder="Name or email"
          />
        </div>

        <div className="space-y-3 pt-5 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Write a comment..."
            />
            <Button size="sm" onClick={handleAddComment}>Post</Button>
          </div>
          <div className="space-y-3 mt-4">
            {(Array.isArray(card.comments) ? card.comments : []).map(c => (
              <div key={c.id} className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-800">{c.author}</span>
                  <span className="text-[10px] font-medium text-zinc-400">{new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-sm text-zinc-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmPrompt
        isOpen={isConfirmOpen}
        title="Delete Card"
        description="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
