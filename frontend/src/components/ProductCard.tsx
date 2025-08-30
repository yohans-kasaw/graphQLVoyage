import { Product } from '../types/product';
import { getProductStatus } from '../utils/productUtils';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const status = getProductStatus(product);

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(product)}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center flex-1">
          <div className="min-w-0 flex-1">
            <div className="font-medium">{product.name}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium">SKU:</span> {product.sku}
          </div>
          <div className="text-sm">
            <span className="font-medium">WH:</span> {product.warehouse}
          </div>
          <div className="text-sm">
            <span className="font-medium">Stock:</span> {product.stock}
          </div>
          <div className="text-sm">
            <span className="font-medium">Demand:</span> {product.demand}
          </div>
          <Badge color={status.color}>{status.label}</Badge>
        </div>
        <div className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
