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
      <form onSubmit={handleSubmit} className="p-2 bg-zinc-950 border-2 border-lime-400 shadow-[4px_4px_0_0_#ccff00]">
        <input
          autoFocus
          type="text"
          placeholder="NODE_TITLE..."
          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-sm font-sans font-bold text-zinc-100 focus:outline-none focus:border-lime-400 mb-2 placeholder-zinc-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsAdding(false);
          }}
        />
        <div className="flex items-center justify-between">
          <Button type="submit" size="sm" variant="primary">Inject</Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
            <X className="w-4 h-4 text-zinc-400 hover:text-red-500" />
          </Button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex items-center gap-2 w-full p-2 text-[10px] font-mono font-bold text-zinc-500 hover:text-lime-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 uppercase tracking-widest transition-colors"
    >
      <Plus className="w-3 h-3" />
      Create Node
    </button>
  );
}
