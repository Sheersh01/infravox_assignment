import React from 'react';
import { useBoardStore } from '../../store/boardStore';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

export function ActivityLog() {
  const activityLog = useBoardStore((state) => state.activityLog);

  if (activityLog.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Activity Log</h3>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {activityLog.map((entry) => (
          <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-blue-500 group-[.is-active]:border-blue-500 shrink-0 z-10 ml-0 md:mx-auto">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            
            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-200">{entry.action}</span>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                </span>
              </div>
              {entry.details && (
                <p className="text-xs text-slate-400">{entry.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
