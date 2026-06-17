import React from 'react';
import { useBoardStore } from '../../store/boardStore';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

export function ActivityLog() {
  const activityLog = useBoardStore((state) => state.activityLog);

  if (activityLog.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-600 font-mono text-sm border-l-2 border-zinc-800 h-full flex flex-col items-center justify-center">
        <Activity className="w-8 h-8 mb-4 opacity-30" />
        <p>AWAITING ACTIVITY_</p>
      </div>
    );
  }

  return (
    <div className="h-full border-l-2 border-zinc-800 bg-zinc-950 flex flex-col">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <h3 className="text-xs font-bold font-mono text-lime-400 uppercase tracking-widest">
          System_Log
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">Live</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activityLog.map((entry) => (
          <div key={entry.id} className="border-l-2 border-zinc-700 pl-3 py-1 hover:border-lime-400 transition-colors group">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider group-hover:text-lime-400 transition-colors">
                {entry.action}
              </span>
              <span className="text-[9px] font-mono text-zinc-500">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
              </span>
            </div>
            {entry.details && (
              <p className="text-xs font-mono text-zinc-400 break-words">{entry.details}</p>
            )}
            <div className="mt-1 text-[9px] font-mono text-zinc-600">
              ORIGIN: {entry.tabId.substring(0, 8)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
