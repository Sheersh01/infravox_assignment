"use client";
import { useState, useEffect } from 'react';
import { SYNC_CHANNEL_NAME } from '../constants/board';

// A simple hook to track how many tabs are open using a separate broadcast channel or the same one.
// We'll use a specific channel for tab presence.
export const PRESENCE_CHANNEL_NAME = 'kanbanflow-presence';

export function useTabRegistry(tabId: string) {
  const [activeTabs, setActiveTabs] = useState<Set<string>>(new Set([tabId]));

  useEffect(() => {
    const channel = new BroadcastChannel(PRESENCE_CHANNEL_NAME);

    // Broadcast our presence periodically
    const pingInterval = setInterval(() => {
      channel.postMessage({ type: 'ping', tabId });
    }, 2000);

    // Remove stale tabs periodically
    const cleanupInterval = setInterval(() => {
      setActiveTabs((prev) => {
        // Since we don't track timestamps here perfectly to avoid complexity,
        // a more robust way is to track last seen times. Let's do that internally.
        return prev;
      });
    }, 5000);
    
    // We will track last seen internally
    const lastSeen = new Map<string, number>();
    lastSeen.set(tabId, Date.now());

    const handleMessage = (event: MessageEvent) => {
      const { type, tabId: incomingTabId } = event.data;
      if (type === 'ping') {
        lastSeen.set(incomingTabId, Date.now());
        setActiveTabs((prev) => {
          if (!prev.has(incomingTabId)) {
            const next = new Set(prev);
            next.add(incomingTabId);
            return next;
          }
          return prev;
        });
        
        // Respond to pings if they are new (could just broadcast another ping)
      } else if (type === 'close') {
        lastSeen.delete(incomingTabId);
        setActiveTabs((prev) => {
          const next = new Set(prev);
          next.delete(incomingTabId);
          return next;
        });
      }
    };

    channel.addEventListener('message', handleMessage);

    // Initial ping
    channel.postMessage({ type: 'ping', tabId });

    // Stale tab cleanup
    const staleInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      setActiveTabs((prev) => {
        const next = new Set(prev);
        for (const [id, time] of lastSeen.entries()) {
          if (now - time > 6000 && id !== tabId) {
            next.delete(id);
            lastSeen.delete(id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 3000);

    const handleBeforeUnload = () => {
      channel.postMessage({ type: 'close', tabId });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(pingInterval);
      clearInterval(cleanupInterval);
      clearInterval(staleInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      channel.postMessage({ type: 'close', tabId });
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [tabId]);

  return { activeTabCount: activeTabs.size };
}
