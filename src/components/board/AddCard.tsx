import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface AddCardProps {
  columnId: string;
}

export function AddCard({ columnId }: AddCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const addCard = useBoardStore((state) => state.addCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addCard(columnId, title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border-2 border-indigo-500 overflow-hidden">
        <div className="p-3">
          <input
            autoFocus
            type="text"
            placeholder="What needs to be done?"
            className="w-full text-sm text-zinc-900 focus:outline-none placeholder-zinc-400 font-semibold p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsAdding(false);
            }}
          />
        </div>
        <div className="flex items-center justify-between bg-zinc-50 px-3 py-2 border-t border-zinc-100">
          <Button type="submit" size="sm" variant="primary" className="rounded-lg">Add Card</Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
            <X className="w-4 h-4 text-zinc-500" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex items-center gap-2 w-full p-3 text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 rounded-xl transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add a card
    </button>
  );
}
