export { formatPkr } from '@/src/lib/currency/formatCurrency';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
