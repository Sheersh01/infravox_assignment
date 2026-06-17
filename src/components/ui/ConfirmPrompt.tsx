import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmPromptProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPrompt({ isOpen, title, description, onConfirm, onCancel }: ConfirmPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-zinc-200">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <div className="bg-red-100 p-2 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
        </div>
        <p className="text-sm text-zinc-600 mb-8">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
