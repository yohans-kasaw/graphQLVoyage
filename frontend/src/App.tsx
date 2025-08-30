import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { WAREHOUSES_QUERY, PRODUCTS_QUERY } from './graphql/queries';
import { UPDATE_DEMAND, TRANSFER_STOCK } from './graphql/mutations';
import { Product } from './types/product';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import { KPICard } from './components/KPICard';
import { StockDemandChart } from './components/StockDemandChart';
import { ArchiveBoxIcon, CubeIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import './App.css'

export default function App() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pageSize = 10;

  const { data: wData, loading: wLoading } = useQuery(WAREHOUSES_QUERY);
  const { data: pData, loading: pLoading, refetch } = useQuery(PRODUCTS_QUERY, {
    variables: {
      search,
      status: status ? status.toLowerCase() : null,
      warehouse: warehouse || null,
      page,
      pageSize
    }
  });

  const [updateDemand, { loading: updLoading }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      refetch();
      setIsDrawerOpen(false);
      setSelectedProduct(null);
    }
  });

  const [transferStock, { loading: xferLoading }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      refetch();
      setIsDrawerOpen(false);
      setSelectedProduct(null);
    }
  });

  useEffect(() => {
    setPage(1);
  }, [search, status, warehouse]);

  const warehouses = wData?.warehouses ?? [];
  const products: Product[] = pData?.products?.products ?? [];
  const totalProducts = pData?.products?.total ?? 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const warehouseCodes = useMemo(
    () => warehouses.map((w: any) => w.code),
    [warehouses]
  );

  // Calculate KPIs from all products (not just current page)
  const kpis = useMemo(() => {
    if (!pData?.products?.products) return { totalStock: 0, totalDemand: 0, fillRate: 0 };
    
    const allProducts = pData.products.products;
    const totalStock = allProducts.reduce((sum: number, p: Product) => sum + p.stock, 0);
    const totalDemand = allProducts.reduce((sum: number, p: Product) => sum + p.demand, 0);
    const fillableStock = allProducts.reduce((sum: number, p: Product) => sum + Math.min(p.stock, p.demand), 0);
    const fillRate = totalDemand > 0 ? (fillableStock / totalDemand) * 100 : 0;
    
    return { totalStock, totalDemand, fillRate };
  }, [pData?.products?.products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200">
      <header className="bg-white/60 backdrop-blur-lg border-b border-white/30 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <ArchiveBoxIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Inventory Hub
                </h1>
                <p className="text-xs text-gray-500 font-medium">Smart warehouse management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {totalProducts > 0 && (
                <div className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {totalProducts} products
                </div>
              )}
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* KPI Cards */}
        <div className="mb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Total Stock"
              value={kpis.totalStock.toLocaleString()}
              subtitle="units in inventory"
              icon={<CubeIcon />}
              color="blue"
            />
            <KPICard
              title="Total Demand"
              value={kpis.totalDemand.toLocaleString()}
              subtitle="units required"
              icon={<ChartBarIcon />}
              color="purple"
            />
            <KPICard
              title="Fill Rate"
              value={`${kpis.fillRate.toFixed(1)}%`}
              subtitle="demand fulfillment"
              icon={<CheckCircleIcon />}
              color={kpis.fillRate >= 90 ? "green" : kpis.fillRate >= 70 ? "amber" : "green"}
            />
          </div>

          {/* Stock vs Demand Chart */}
          <div className="mb-8">
            <StockDemandChart range="7d" />
          </div>
          
          <Filters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            warehouse={warehouse}
            setWarehouse={setWarehouse}
            warehouseCodes={warehouseCodes}
          />
        </div>

        {(wLoading || pLoading) && (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading inventory...</p>
          </div>
        )}

        {!pLoading && products.length === 0 && (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-16 text-center max-w-5xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ArchiveBoxIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search or filter criteria to find what you're looking for</p>
          </div>
        )}

        <div className="grid gap-4 animate-in fade-in duration-500 max-w-5xl mx-auto">
          {products.map((p, index) => (
            <div 
              key={`${p.id}-${p.warehouse}`}
              className="animate-in slide-in-from-bottom duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard
                product={p}
                onClick={handleProductClick}
              />
            </div>
          ))}
        </div>

        {totalProducts > 0 && (
          <div className="mt-12 flex justify-between items-center bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/30 max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-bold text-indigo-600">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-bold text-indigo-600">{Math.min(page * pageSize, totalProducts)}</span> of{' '}
                <span className="font-bold text-indigo-600">{totalProducts}</span> results
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-5 py-2.5 border border-indigo-200/50 rounded-xl bg-white/50 text-sm font-medium text-indigo-700 hover:bg-white/80 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm backdrop-blur-sm"
              >
                Previous
              </button>
              <div className="flex items-center px-3 py-2 bg-indigo-100/50 backdrop-blur-sm rounded-xl">
                <span className="text-sm font-bold text-indigo-700">{page}</span>
                <span className="text-sm text-indigo-500 mx-1">of</span>
                <span className="text-sm font-bold text-indigo-700">{totalPages}</span>
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="px-5 py-2.5 border border-indigo-300 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          allWarehouses={warehouseCodes}
          onUpdateDemand={async (id, demand) =>
            updateDemand({
              variables: { id, demand: Number(demand) }
            }).catch((e) => alert(e.message))
          }
          onTransfer={async ({ id, from, to, qty }) => {
            try {
              await transferStock({
                variables: { id, from, to, qty: Number(qty) }
              });
            } catch (e: any) {
              console.error('Transfer error:', e);
              alert(e.message || 'Transfer failed');
            }
          }}
          busy={updLoading || xferLoading}
        />
      </main>
    </div>
  );
}
