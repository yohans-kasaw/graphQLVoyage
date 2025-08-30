import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { WAREHOUSES_QUERY, PRODUCTS_QUERY } from './graphql/queries';
import { UPDATE_DEMAND, TRANSFER_STOCK } from './graphql/mutations';
import { Product } from './types/product';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center">
            <ArchiveBoxIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your product inventory across warehouses</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Filters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          warehouse={warehouse}
          setWarehouse={setWarehouse}
          warehouseCodes={warehouseCodes}
        />

        <div className="mt-6 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {totalProducts > 0 ? `Products (${totalProducts})` : 'Products'}
          </h2>
        </div>

        {(wLoading || pLoading) && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!pLoading && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {products.map((p) => (
            <ProductCard
              key={`${p.id}-${p.warehouse}`}
              product={p}
              onClick={handleProductClick}
            />
          ))}
        </div>

        {totalProducts > 0 && (
          <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * pageSize, totalProducts)}</span> of{' '}
              <span className="font-medium">{totalProducts}</span> results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md bg-indigo-50 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          onTransfer={async ({ id, from, to, qty }) =>
            transferStock({
              variables: { id, from, to, qty: Number(qty) }
            }).catch((e) => alert(e.message))
          }
          busy={updLoading || xferLoading}
        />
      </main>
    </div>
  );
}
