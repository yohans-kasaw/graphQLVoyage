import { useState } from 'react';
import { Product, TransferInput } from '../types/product';
import { getProductStatus } from '../utils/productUtils';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  allWarehouses: string[];
  onUpdateDemand: (id: string, demand: number) => Promise<any>;
  onTransfer: (input: TransferInput) => Promise<any>;
  busy?: boolean;
}

export function ProductCard({
  product,
  allWarehouses,
  onUpdateDemand,
  onTransfer,
  busy
}: ProductCardProps) {
  const [demand, setDemand] = useState<number>(product.demand);
  const [showTransfer, setShowTransfer] = useState(false);
  const [to, setTo] = useState<string>('');
  const [qty, setQty] = useState<number>(0);

  const status = getProductStatus(product);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Demand</label>
            <input
              type="number"
              value={demand}
              min={0}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-24 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              disabled={busy}
              onClick={() => onUpdateDemand(product.id, demand)}
              className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
          <Badge color={status.color}>{status.label}</Badge>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border hover:bg-gray-50"
            onClick={() => setShowTransfer((s) => !s)}
          >
            Transfer
          </button>
        </div>
      </div>

      {showTransfer && (
        <div className="mt-3 border-t pt-3 flex flex-col md:flex-row gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">From</label>
            <input
              value={product.warehouse}
              disabled
              className="w-36 rounded border-gray-200 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-36 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              {allWarehouses
                .filter((w) => w !== product.warehouse)
                .map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Qty</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-28 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            disabled={busy || !to || qty <= 0}
            className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            onClick={() =>
              onTransfer({ id: product.id, from: product.warehouse, to, qty })
            }
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
