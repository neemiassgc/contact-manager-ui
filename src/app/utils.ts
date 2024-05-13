export function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}