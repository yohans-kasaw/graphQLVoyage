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
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
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
                    <div className="flex items-center justify-between p-5 border-b bg-indigo-50">
                      <Dialog.Title className="text-xl font-semibold text-indigo-900">
                        Product Details
                      </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-indigo-100 rounded-full text-indigo-700 transition-colors"
              aria-label="Close drawer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'details' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <div className="flex items-center justify-center">
                <ArchiveBoxIcon className="w-4 h-4 mr-2" />
                Details
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'demand' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('demand')}
            >
              <div className="flex items-center justify-center">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Update Demand
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'transfer' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('transfer')}
            >
              <div className="flex items-center justify-center">
                <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
                Transfer
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <Badge color={status.color} size="md">{status.label}</Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Stock vs Demand</h4>
                  <div className="bg-gray-100 rounded-full h-4 mb-1">
                    <div 
                      className={`h-4 rounded-full ${status.color === 'green' ? 'bg-green-500' : status.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>{stockPercentage}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demand' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Update Product Demand</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Adjust the demand level for this product. This will affect inventory planning and stock status calculations.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Demand:</span>
                    <span className="text-sm font-semibold text-gray-900">{product.demand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Current Stock:</span>
                    <span className="text-sm font-semibold text-gray-900">{product.stock}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Demand Level
                    </label>
                    <input
                      type="number"
                      value={demand}
                      min={0}
                      onChange={(e) => setDemand(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button
                    disabled={busy || demand === product.demand}
                    onClick={() => onUpdateDemand(product.id, demand)}
                    className="w-full px-4 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {busy ? 'Updating...' : 'Update Demand'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Stock</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Move inventory between warehouses to balance stock levels and meet regional demand.
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-indigo-800">
                      Available stock for transfer: <span className="font-bold">{product.stock}</span>
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Warehouse
                    </label>
                    <input
                      value={product.warehouse}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Warehouse
                    </label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select destination warehouse</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to Transfer
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {qty > product.stock && (
                      <p className="mt-1 text-sm text-red-600">
                        Cannot transfer more than available stock.
                      </p>
                    )}
                  </div>
                  
                  <button
                    disabled={busy || !to || qty <= 0 || qty > product.stock}
                    className="w-full px-4 py-3 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                    onClick={() =>
                      onTransfer({ id: product.id, from: product.warehouse, to, qty })
                    }
                  >
                    {busy ? 'Processing...' : 'Transfer Stock'}
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
