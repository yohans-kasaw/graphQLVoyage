import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { WAREHOUSES_QUERY, PRODUCTS_QUERY } from './graphql/queries';
import { UPDATE_DEMAND, TRANSFER_STOCK } from './graphql/mutations';
import { Product } from './types/product';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import './App.css'

export default function App() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [warehouse, setWarehouse] = useState('');

  const { data: wData, loading: wLoading } = useQuery(WAREHOUSES_QUERY);
  const { data: pData, loading: pLoading, refetch } = useQuery(PRODUCTS_QUERY, {
    variables: { search, status: status || null, warehouse: warehouse || null }
  });

  const [updateDemand, { loading: updLoading }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => refetch()
  });

  const [transferStock, { loading: xferLoading }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => refetch()
  });

  const warehouses = wData?.warehouses ?? [];
  const products: Product[] = pData?.products ?? [];

  const warehouseCodes = useMemo(
    () => warehouses.map((w: any) => w.code),
    [warehouses]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Filters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          warehouse={warehouse}
          setWarehouse={setWarehouse}
          warehouseCodes={warehouseCodes}
        />

        {(wLoading || pLoading) && (
          <p className="text-gray-500 mt-4">Loading...</p>
        )}

        {!pLoading && products.length === 0 && (
          <p className="text-gray-500 mt-4">No products found.</p>
        )}

        <div className="mt-6 grid gap-4">
          {products.map((p) => (
            <ProductCard
              key={`${p.id}-${p.warehouse}`}
              product={p}
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
          ))}
        </div>
      </main>
    </div>
  );
}
