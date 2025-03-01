export function editAt<T>(array: T[], index: number, value: T): T[] {
  const newArray: T[] = array.slice(0);
  newArray[index] = value;
  return newArray;
};