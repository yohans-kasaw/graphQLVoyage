import { useState, useEffect } from 'react';
import { Product, TransferInput } from '../types/product';
import { getProductStatus } from '../utils/productUtils';
import { Badge } from './Badge';

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  allWarehouses: string[];
  onUpdateDemand: (id: string, demand: number) => Promise<any>;
  onTransfer: (input: TransferInput) => Promise<any>;
  busy?: boolean;
}

export function ProductDrawer({
  product,
  isOpen,
  onClose,
  allWarehouses,
  onUpdateDemand,
  onTransfer,
  busy
}: ProductDrawerProps) {
  const [demand, setDemand] = useState<number>(0);
  const [to, setTo] = useState<string>('');
  const [qty, setQty] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setDemand(product.demand);
      setTo('');
      setQty(0);
    }
  }, [product]);

  if (!product) return null;

  const status = getProductStatus(product);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Product Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Product Information</h3>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <div className="text-sm">{product.name}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">SKU:</span>
                  <div className="text-sm">{product.sku}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Warehouse:</span>
                  <div className="text-sm">{product.warehouse}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Stock:</span>
                  <div className="text-sm">{product.stock}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Current Demand:</span>
                  <div className="text-sm">{product.demand}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="mt-1">
                    <Badge color={status.color}>{status.label}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Demand Form */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Update Demand</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Demand
                  </label>
                  <input
                    type="number"
                    value={demand}
                    min={0}
                    onChange={(e) => setDemand(Number(e.target.value))}
                    className="w-full rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  disabled={busy}
                  onClick={() => onUpdateDemand(product.id, demand)}
                  className="w-full px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Update Demand
                </button>
              </div>
            </div>

            {/* Transfer Stock Form */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Transfer Stock</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Warehouse
                  </label>
                  <input
                    value={product.warehouse}
                    disabled
                    className="w-full rounded border-gray-200 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Warehouse
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select warehouse</option>
                    {allWarehouses
                      .filter((w) => w !== product.warehouse)
                      .map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  disabled={busy || !to || qty <= 0 || qty > product.stock}
                  className="w-full px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  onClick={() =>
                    onTransfer({ id: product.id, from: product.warehouse, to, qty })
                  }
                >
                  Transfer Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
