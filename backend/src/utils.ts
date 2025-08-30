import type { Product } from './types';

export function statusOf(p: Product): 'shortage' | 'balanced' | 'overstock' {
  if (p.stock < p.demand) return 'shortage';
  if (p.stock > p.demand) return 'overstock';
  return 'balanced';
}

export function parseRange(range: string): number {
  const lower = range.toLowerCase();
  if (lower === '7d') return 7;
  if (lower === '30d' || lower === '1m') return 30;
  if (lower === '90d' || lower === '3m') return 90;
  const num = parseInt(lower, 10);
  return Number.isFinite(num) && num > 0 ? num : 7;
}

export function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
