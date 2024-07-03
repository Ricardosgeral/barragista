/**
 * Checks if the given string is a valid CUID.
 * @param id - The string to check.
 * @returns true if the string is a valid CUID, false otherwise.
 */
export function isCuid(id: string): boolean {
  const cuidRegex = /^c[0-9a-z]{24}$/;
  return cuidRegex.test(id);
}
