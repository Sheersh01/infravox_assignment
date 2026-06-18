"use client";
import React from 'react';
import { useBoardStore } from '../../store/boardStore';
import { formatDistanceToNow } from 'date-fns';
import { getFriendlyTabName } from '../../utils/tabRegistry';
import { Activity, Clock } from 'lucide-react';

export function ActivityLog() {
  const activityLog = useBoardStore((state) => state.activityLog);

  if (activityLog.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm h-full flex flex-col items-center justify-center bg-white">
        <Activity className="w-12 h-12 mb-4 text-zinc-300" />
        <p className="font-medium">No activity yet</p>
        <p className="text-xs text-zinc-400 mt-1">Actions will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 className="text-base font-bold text-zinc-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Activity Log
        </h3>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Live</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activityLog.map((entry) => (
          <div key={entry.id} className="relative pl-4 border-l-2 border-zinc-100 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-zinc-200 group-hover:border-indigo-400 transition-colors" />
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-zinc-800 leading-snug">
                  {entry.action} {entry.details ? entry.details.toLowerCase() : ''}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-medium text-zinc-400">
                  {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                </span>
                <span className="text-[10px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded font-mono">
                  {getFriendlyTabName(entry.tabId)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
