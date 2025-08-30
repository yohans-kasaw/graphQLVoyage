import { statusOptions } from '../utils/productUtils';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  warehouse: string;
  setWarehouse: (value: string) => void;
  warehouseCodes: string[];
}

export function Filters({
  search,
  setSearch,
  status,
  setStatus,
  warehouse,
  setWarehouse,
  warehouseCodes
}: FiltersProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, SKUs, or names..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-44 py-3.5 px-4 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 text-gray-900 shadow-sm appearance-none cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="w-full sm:w-44 py-3.5 px-4 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 text-gray-900 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">All Warehouses</option>
              {warehouseCodes.map((code) => (
                <option key={code} value={code}>
                  Warehouse {code}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
