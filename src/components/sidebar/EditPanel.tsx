import React, { useState, useEffect } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../ui/Button';
import { ConfirmPrompt } from '../ui/ConfirmPrompt';
import { X, Trash2, Save, TerminalSquare, MessageSquare } from 'lucide-react';

interface EditPanelProps {
  cardId: string;
}

export function EditPanel({ cardId }: EditPanelProps) {
  const card = useBoardStore((state) => state.cards[cardId]);
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const selectCard = useBoardStore((state) => state.selectCard);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<any>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setPriority(card.priority);
      setDueDate(card.dueDate || '');
      setAssignee(card.assignee || '');
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    updateCard(cardId, {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      assignee: assignee || null,
      comments: card.comments,
    });
  };

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
        author: 'USR_1',
      };
      updateCard(cardId, {
        comments: [...card.comments, commentObj],
      });
      setNewComment('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l-2 border-zinc-800">
      <div className="p-4 border-b-2 border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-5 h-5 text-lime-400" />
          <h2 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-widest">Inspect</h2>
        </div>
        <div className="flex items-center gap-2">
          {(Array.isArray(card.comments) ? card.comments : []).length > 0 && (
            <div className="flex items-center gap-1 text-zinc-500 text-xs font-mono" title={`${(Array.isArray(card.comments) ? card.comments : []).length} transmissions`}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{(Array.isArray(card.comments) ? card.comments : []).length}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmOpen(true)} title="Delete Node">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => selectCard(null)}>
            <X className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-widest">Node_Title</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm font-sans font-bold text-zinc-100 focus:outline-none focus:border-lime-400 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Parameters</label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-lime-400 transition-colors h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Initialize node parameters..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Priority</label>
            <select
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-lime-400 transition-colors uppercase"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Deadline</label>
            <input
              type="date"
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-lime-400 transition-colors [color-scheme:dark]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Assignee_ID</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-lime-400 transition-colors uppercase"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="e.g. OP_01"
          />
        </div>

        <div className="space-y-3 pt-6 border-t border-zinc-800">
          <label className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-widest">Transmission_Log</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-lime-400 transition-colors placeholder-zinc-600"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Input data..."
            />
            <Button size="sm" onClick={handleAddComment}>Send</Button>
          </div>
          <div className="space-y-2 mt-4">
            {(Array.isArray(card.comments) ? card.comments : []).map(c => (
              <div key={c.id} className="bg-zinc-900 border-l-2 border-zinc-700 p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-300">{c.author}</span>
                  <span className="text-[9px] font-mono text-zinc-600">{new Date(c.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs font-mono text-zinc-400">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-zinc-800 bg-zinc-950 sticky bottom-0 z-10 flex justify-end">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" /> Write Data
        </Button>
      </div>

      <ConfirmPrompt
        isOpen={isConfirmOpen}
        title="PURGE NODE"
        description="DELETION OF THIS NODE IS IRREVERSIBLE. PROCEED?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
