import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Product, TransferInput } from '../types/product';
import { getProductStatus } from '../utils/productUtils';
import { Badge } from './Badge';
import { XMarkIcon, ArrowsRightLeftIcon, ChartBarIcon, ArchiveBoxIcon, TruckIcon } from '@heroicons/react/24/outline';

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
  const [activeTab, setActiveTab] = useState<'details' | 'demand' | 'transfer'>('details');

  useEffect(() => {
    if (product) {
      setDemand(product.demand);
      setTo('');
      setQty(0);
      setActiveTab('details');
    }
  }, [product]);

  if (!product) return null;

  const status = getProductStatus(product);
  const stockRatio = product.stock / Math.max(1, product.demand);
  const stockPercentage = Math.min(100, Math.round(stockRatio * 100));

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-xs" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen sm:w-[450px]">
                  <div className="flex flex-col h-full bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'details' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'demand' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('demand')}
            >
              Demand
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === 'transfer' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('transfer')}
            >
              Transfer
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge color={status.color}>{status.label}</Badge>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">SKU</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{product.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Warehouse</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{product.warehouse}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stock</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Demand</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{product.demand}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Stock Level</span>
                    <span className="font-medium">{stockPercentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${status.color === 'green' ? 'bg-green-500' : status.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demand' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Demand:</span>
                    <span className="text-sm font-semibold text-gray-900">{product.demand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Current Stock:</span>
                    <span className="text-sm font-semibold text-gray-900">{product.stock}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demand Level
                    </label>
                    <input
                      type="number"
                      value={demand}
                      min={0}
                      onChange={(e) => setDemand(Number(e.target.value))}
                      className="w-full rounded border py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button
                    disabled={busy || demand === product.demand}
                    onClick={() => onUpdateDemand(product.id, demand)}
                    className="w-full py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {busy ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded border text-sm">
                  Available: <span className="font-semibold">{product.stock}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      value={product.warehouse}
                      disabled
                      className="w-full rounded border bg-gray-50 py-2 px-3 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full rounded border py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-full rounded border py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button
                    disabled={busy || !to || qty <= 0 || qty > product.stock}
                    className="w-full py-2 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                    onClick={() =>
                      onTransfer({ id: product.id, from: product.warehouse, to, qty })
                    }
                  >
                    {busy ? 'Processing...' : 'Transfer'}
                  </button>
                </div>
              </div>
            )}
          </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
