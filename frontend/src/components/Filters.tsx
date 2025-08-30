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
    <div className="bg-white p-5 rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <FunnelIcon className="h-5 w-5 mr-2 text-indigo-600" />
        Filter Products
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, or SKU"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Warehouses</option>
            {warehouseCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
