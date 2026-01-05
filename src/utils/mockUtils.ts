/**
 * Simulate network delay for mock data
 */
export const delay = (ms = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Deep clone an array of objects
 */
export function cloneArray<T>(arr: T[]): T[] {
  return arr.map(item => structuredClone(item));
}

/**
 * Deep clone a Record<number, T[]> structure (e.g., grouped by projectId)
 */
export function cloneGroupedArray<T>(record: Record<number, T[]>): Record<number, T[]> {
  const cloned: Record<number, T[]> = {};
  for (const [key, value] of Object.entries(record)) {
    cloned[Number(key)] = cloneArray(value);
  }
  return cloned;
}
