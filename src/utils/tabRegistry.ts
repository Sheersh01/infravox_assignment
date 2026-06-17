const memCache = new Map<string, string>();

export function getFriendlyTabName(tabId: string): string {
  // SSR Safety
  if (typeof window === 'undefined') return 'Tab ...';
  
  // Fast memory cache
  if (memCache.has(tabId)) return memCache.get(tabId)!;

  try {
    const registry = JSON.parse(localStorage.getItem('kanbanflow-tab-registry') || '{}');
    
    if (registry[tabId]) {
      memCache.set(tabId, registry[tabId]);
      return registry[tabId];
    }
    
    // Assign a new sequential number for this tab
    const usedNumbers = Object.values(registry)
      .map((name: any) => parseInt(name.replace('Tab ', ''), 10))
      .filter((n) => !isNaN(n));
      
    const nextNum = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
    const newName = `Tab ${nextNum}`;
    
    registry[tabId] = newName;
    localStorage.setItem('kanbanflow-tab-registry', JSON.stringify(registry));
    
    memCache.set(tabId, newName);
    return newName;
  } catch (e) {
    // Fallback if localStorage is inaccessible
    return `Tab: ${tabId.substring(0, 4)}`;
  }
}
