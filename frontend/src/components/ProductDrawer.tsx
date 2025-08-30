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
  const [demandError, setDemandError] = useState<string>('');
  const [transferError, setTransferError] = useState<string>('');

  useEffect(() => {
    if (product) {
      setDemand(product.demand);
      setTo('');
      setQty(0);
      setActiveTab('details');
      setDemandError('');
      setTransferError('');
    }
  }, [product]);

  const validateDemand = (value: number): string => {
    if (!Number.isInteger(value)) return 'Demand must be a whole number';
    if (value < 0) return 'Demand cannot be negative';
    return '';
  };

  const validateTransfer = (toWarehouse: string, quantity: number): string => {
    if (!toWarehouse) return 'Please select a destination warehouse';
    if (!Number.isInteger(quantity)) return 'Quantity must be a whole number';
    if (quantity <= 0) return 'Quantity must be greater than 0';
    if (quantity > product.stock) return `Cannot transfer more than available stock (${product.stock})`;
    return '';
  };

  const handleDemandChange = (value: number) => {
    setDemand(value);
    setDemandError(validateDemand(value));
  };

  const handleTransferChange = (toWarehouse: string, quantity: number) => {
    setTo(toWarehouse);
    setQty(quantity);
    setTransferError(validateTransfer(toWarehouse, quantity));
  };

  const isDemandValid = demand >= 0 && Number.isInteger(demand) && demandError === '';
  const isTransferValid = to && qty > 0 && qty <= product.stock && Number.isInteger(qty) && transferError === '';

  if (!product) return null;

  const status = getProductStatus(product);
  const stockRatio = product.stock / Math.max(1, product.demand);
  const stockPercentage = Math.min(100, Math.round(stockRatio * 100));

  const tabs = [
    { id: 'details', label: 'Details', icon: ArchiveBoxIcon },
    { id: 'demand', label: 'Demand', icon: ChartBarIcon },
    { id: 'transfer', label: 'Transfer', icon: TruckIcon }
  ];

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
                <Dialog.Panel className="pointer-events-auto w-screen sm:w-[480px]">
                  <div className="flex flex-col h-full bg-gradient-to-br from-white/80 to-gray-50/50 shadow-2xl backdrop-blur-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/30 bg-white/60 backdrop-blur-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                        <Dialog.Title className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {product.name}
                        </Dialog.Title>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-700 transition-all duration-200"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

          {/* Tabs */}
          <div className="flex border-b border-white/30 bg-white/20 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-4 px-2 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-white/60' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <Badge color={status.color}>{status.label}</Badge>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ID: {product.id}
                  </div>
                </div>
                
                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm">
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
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Stock Level</span>
                    <span className="font-bold text-gray-900">{stockPercentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ease-out ${
                        status.color === 'green' 
                          ? 'bg-gradient-to-r from-green-400 to-green-600' 
                          : status.color === 'yellow' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demand' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-blue-100/30 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{product.demand}</div>
                      <div className="text-xs text-blue-500 font-medium">Current Demand</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{product.stock}</div>
                      <div className="text-xs text-green-500 font-medium">Current Stock</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      New Demand Level
                    </label>
                    <input
                      type="number"
                      value={demand}
                      min={0}
                      step={1}
                      onChange={(e) => handleDemandChange(Number(e.target.value))}
                      className={`w-full rounded-xl border py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        demandError ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-gray-200/50'
                      }`}
                    />
                    {demandError && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        ⚠️ {demandError}
                      </p>
                    )}
                  </div>
                  
                  <button
                    disabled={busy || demand === product.demand || !isDemandValid}
                    onClick={() => onUpdateDemand(product.id, demand)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {busy ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Update Demand'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-emerald-100/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-700">Available Stock</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-lg font-bold text-emerald-600">{product.stock}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">From Warehouse</label>
                    <input
                      value={`Warehouse ${product.warehouse}`}
                      disabled
                      className="w-full rounded-xl border border-gray-200/50 bg-white/30 py-3 px-4 text-gray-600 font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">To Warehouse</label>
                    <div className="relative">
                      <select
                        value={to}
                        onChange={(e) => handleTransferChange(e.target.value, qty)}
                        className={`w-full rounded-xl border py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${
                          transferError && !to ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-gray-200/50'
                        }`}
                      >
                        <option value="">Select destination warehouse</option>
                        {allWarehouses
                          .filter((w) => w !== product.warehouse)
                          .map((w) => (
                            <option key={w} value={w}>
                              Warehouse {w}
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
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quantity to Transfer</label>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      step={1}
                      value={qty}
                      onChange={(e) => handleTransferChange(to, Number(e.target.value))}
                      className={`w-full rounded-xl border py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        transferError && qty > 0 ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-gray-200/50'
                      }`}
                      placeholder="Enter quantity"
                    />
                    {transferError && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        ⚠️ {transferError}
                      </p>
                    )}
                  </div>
                  
                  <button
                    disabled={busy || !isTransferValid}
                    className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl ${
                      busy || !isTransferValid
                        ? 'bg-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                    onClick={() =>
                      onTransfer({ id: product.id, from: product.warehouse, to, qty })
                    }
                  >
                    {busy ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Transfer...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <TruckIcon className="w-5 h-5" />
                        <span>Transfer Stock</span>
                      </div>
                    )}
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
