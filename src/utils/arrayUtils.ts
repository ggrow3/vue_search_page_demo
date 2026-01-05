/**
 * Update an item in an array by its ID
 * @returns true if item was found and updated
 */
export function updateItemById<T extends { id: number }>(
  array: T[],
  id: number,
  updatedItem: T | null
): boolean {
  if (!updatedItem) return false;
  const index = array.findIndex(item => item.id === id);
  if (index !== -1) {
    array[index] = updatedItem;
    return true;
  }
  return false;
}

/**
 * Remove an item from an array by its ID
 * @returns true if item was found and removed
 */
export function removeItemById<T extends { id: number }>(
  array: T[],
  id: number
): boolean {
  const index = array.findIndex(item => item.id === id);
  if (index !== -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
