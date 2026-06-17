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
      <form onSubmit={handleSubmit} className="mt-2 p-2 bg-slate-800 rounded-lg border border-slate-700">
        <input
          autoFocus
          type="text"
          placeholder="Enter a title for this card..."
          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsAdding(false);
          }}
        />
        <div className="flex items-center justify-between">
          <Button type="submit" size="sm" variant="primary">Add card</Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="mt-2 flex items-center gap-2 w-full p-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add a card
    </button>
  );
}
