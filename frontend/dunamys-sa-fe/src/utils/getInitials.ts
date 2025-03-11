export function getInitials(nombre?: string): string {
  const n = nombre?.[0]?.toUpperCase() || '';
  const u = nombre?.[1]?.toUpperCase() || '';
  return n + u;
}
