export function isNull(value?: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  return false;
}
