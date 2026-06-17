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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border-2 border-red-500 shadow-[8px_8px_0_0_#ff3333] max-w-sm w-full p-1 relative">
        <div className="border border-zinc-800 p-5">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-bold font-sans uppercase tracking-wider">{title}</h3>
          </div>
          <p className="text-sm font-mono text-zinc-400 mb-8">{description}</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>Abort</Button>
            <Button variant="danger" onClick={onConfirm}>Execute</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
