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
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-40 py-2 px-3 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="w-full md:w-40 py-2 px-3 border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
  );
}
