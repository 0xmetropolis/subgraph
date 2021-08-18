/**
 * Removes an item from an array and returns the new array.
 * @param arr 
 * @param value 
 * @returns 
 */
export function removeItem(arr: Array<string> | null, value: string): Array<string> | null { 
  let index = arr.indexOf(value);
  if (index > -1) {
      arr.splice(index, 1);
  }
  return arr;
}