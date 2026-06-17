import { useEffect, useCallback } from 'react';
import { SYNC_CHANNEL_NAME } from '../constants/board';
import { BoardData } from '../types/board';

type SyncMessage = {
  type: 'sync_state';
  tabId: string;
  payload: BoardData;
} | {
  type: 'drag_state';
  tabId: string;
  cardId: string;
  isDragging: boolean;
};

export function useBroadcast(
  tabId: string,
  onSync: (state: BoardData) => void,
  onDragStateChange?: (cardId: string, tabId: string, isDragging: boolean) => void
) {
  useEffect(() => {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);

    const handleMessage = (event: MessageEvent<SyncMessage>) => {
      const message = event.data;
      if (message.tabId === tabId) return;

      if (message.type === 'sync_state') {
        onSync(message.payload);
      } else if (message.type === 'drag_state' && onDragStateChange) {
        onDragStateChange(message.cardId, message.tabId, message.isDragging);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [tabId, onSync]);

  const broadcastState = useCallback((state: BoardData) => {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.postMessage({
      type: 'sync_state',
      tabId,
      payload: state,
    } as SyncMessage);
    channel.close();
  }, [tabId]);

  const broadcastDragState = useCallback((cardId: string, isDragging: boolean) => {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.postMessage({
      type: 'drag_state',
      tabId,
      cardId,
      isDragging,
    } as SyncMessage);
    channel.close();
  }, [tabId]);

  return { broadcastState, broadcastDragState };
}
