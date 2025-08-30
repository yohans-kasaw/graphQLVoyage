import { Product, ProductStatus } from '../types/product';

export function getProductStatus(product: Product): ProductStatus {
  if (product.stock < product.demand) {
    return { label: 'Critical', color: 'red' };
  }
  if (product.stock > product.demand) {
    return { label: 'Healthy', color: 'green' };
  }
  return { label: 'Low', color: 'yellow' };
}

export const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Critical', value: 'critical' },
  { label: 'Low', value: 'low' },
  { label: 'Healthy', value: 'healthy' }
];
