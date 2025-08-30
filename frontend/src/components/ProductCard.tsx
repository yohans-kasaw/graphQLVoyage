import { Product } from '../types/product';
import { getProductStatus } from '../utils/productUtils';
import { Badge } from './Badge';
import { ArrowRightIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const status = getProductStatus(product);
  const stockRatio = product.stock / Math.max(1, product.demand);
  const stockPercentage = Math.min(100, Math.round(stockRatio * 100));

  return (
    <div 
      className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all hover:border-indigo-200 group"
      onClick={() => onClick(product)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <ArchiveBoxIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Warehouse:</span>{' '}
            <span className="font-medium text-gray-900">{product.warehouse}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Stock: <span className="font-medium text-gray-900">{product.stock}</span></span>
              <span className="text-sm text-gray-500">Demand: <span className="font-medium text-gray-900">{product.demand}</span></span>
            </div>
            <div className="w-36 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${status.color === 'green' ? 'bg-green-500' : status.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <Badge color={status.color} size="md">{status.label}</Badge>
          
          <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
            <ArrowRightIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
