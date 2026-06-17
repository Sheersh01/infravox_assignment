import React, { useState, useEffect } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../ui/Button';
import { ConfirmPrompt } from '../ui/ConfirmPrompt';
import { X, Trash2, Save, Calendar, User, AlignLeft, Flag } from 'lucide-react';

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
    // Optional: close after save, or keep open
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
        author: 'Me', // Simplified for local-first
      };
      updateCard(cardId, {
        comments: [...card.comments, commentObj],
      });
      setNewComment('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
        <h2 className="text-lg font-semibold text-slate-100">Edit Card</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmOpen(true)} title="Delete Card">
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => selectCard(null)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <AlignLeft className="w-3 h-3" /> Description
          </label>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <Flag className="w-3 h-3" /> Priority
            </label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3 h-3" /> Due Date
            </label>
            <input
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <User className="w-3 h-3" /> Assignee
          </label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Comments</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Write a comment..."
            />
            <Button size="sm" onClick={handleAddComment}>Post</Button>
          </div>
          <div className="space-y-3 mt-4">
            {card.comments.map(c => (
              <div key={c.id} className="bg-slate-800/50 p-2 rounded-md border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">{c.author}</span>
                  <span className="text-[10px] text-slate-500">{new Date(c.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-200">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10 flex justify-end">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      <ConfirmPrompt
        isOpen={isConfirmOpen}
        title="Delete Card?"
        description="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
