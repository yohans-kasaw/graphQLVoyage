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
  const isOverstocked = product.stock > product.demand;
  const isUnderstocked = product.stock < product.demand;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/60 cursor-pointer hover:shadow-lg hover:border-indigo-300/60 transition-all duration-300 group hover:bg-white/90 max-w-5xl mx-auto"
      onClick={() => onClick(product)}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Product Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <ArchiveBoxIcon className="w-6 h-6" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              status.color === 'green' ? 'bg-green-400' : 
              status.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
            } ring-2 ring-white`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">
                {product.name}
              </h3>
              <Badge color={status.color} size="sm">{status.label}</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-medium">SKU: {product.sku}</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-1">
                <span>📍</span>
                <span className="font-medium">Warehouse {product.warehouse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stock & Demand Visualization */}
        <div className="flex items-center space-x-6">
          {/* Stock vs Demand Comparison */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 mb-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{product.stock}</div>
                  <div className="text-xs text-blue-500 font-medium">Stock</div>
                </div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                {isOverstocked && <span className="text-green-500 text-lg">📈</span>}
                {isUnderstocked && <span className="text-red-500 text-lg">📉</span>}
                {!isOverstocked && !isUnderstocked && <span className="text-yellow-500 text-lg">⚖️</span>}
                <div className="text-xs font-medium text-gray-500">
                  {isOverstocked ? 'Surplus' : isUnderstocked ? 'Shortage' : 'Balanced'}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    status.color === 'green' 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : status.color === 'yellow' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${stockPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs font-bold text-gray-700">{stockPercentage}%</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 mb-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-600">{product.demand}</div>
                  <div className="text-xs text-emerald-500 font-medium">Demand</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Arrow */}
          <div className="text-indigo-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200">
            <ArrowRightIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
