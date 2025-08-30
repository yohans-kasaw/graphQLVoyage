import { Product, ProductStatus } from '../types/product';

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock < product.demand) {
    return { label: 'Shortage', color: 'yellow' };
  }
  if (product.stock > product.demand) {
    return { label: 'Overstock', color: 'blue' };
  }
  return { label: 'Balanced', color: 'green' };
}

export const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Shortage', value: 'shortage' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Overstock', value: 'overstock' }
];
