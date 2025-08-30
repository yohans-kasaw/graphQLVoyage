import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import './App.css'

const WAREHOUSES_QUERY = gql`
  query Warehouses {
    warehouses {
      code
      name
    }
  }
`;

const PRODUCTS_QUERY = gql`
  query Products($search: String, $status: String, $warehouse: String) {
    products(search: $search, status: $status, warehouse: $warehouse) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
    }
  }
`;

const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) {
      id
      warehouse
      stock
      demand
    }
  }
`;

type Product = {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
};

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Shortage', value: 'shortage' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Overstock', value: 'overstock' }
];

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

function Filters(props: {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  warehouse: string;
  setWarehouse: (v: string) => void;
  warehouseCodes: string[];
}) {
  const {
    search, setSearch,
    status, setStatus,
    warehouse, setWarehouse,
    warehouseCodes
  } = props;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, name, or SKU"
          className="w-full md:flex-1 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Warehouses</option>
          {warehouseCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProductCard(props: {
  product: Product;
  allWarehouses: string[];
  onUpdateDemand: (id: string, demand: number) => Promise<any>;
  onTransfer: (input: { id: string; from: string; to: string; qty: number }) => Promise<any>;
  busy?: boolean;
}) {
  const { product, allWarehouses, onUpdateDemand, onTransfer, busy } = props;
  const [demand, setDemand] = useState<number>(product.demand);
  const [showTransfer, setShowTransfer] = useState(false);
  const [to, setTo] = useState<string>('');
  const [qty, setQty] = useState<number>(0);

  const status = getStatus(product);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">
            {product.id} • {product.sku}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Badge color={status.color}>{status.label}</Badge>
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
                  <option key={w} value={w}>{w}</option>
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

function Badge(props: { children: string; color: 'yellow' | 'green' | 'blue' }) {
  const colorMap = {
    yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    green: 'bg-green-100 text-green-800 ring-green-600/20',
    blue: 'bg-blue-100 text-blue-800 ring-blue-600/20'
  } as const;

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorMap[props.color]}`}>
      {props.children}
    </span>
  );
}

function getStatus(p: Product): { label: string; color: 'yellow' | 'green' | 'blue' } {
  if (p.stock < p.demand) return { label: 'Shortage', color: 'yellow' };
  if (p.stock > p.demand) return { label: 'Overstock', color: 'blue' };
  return { label: 'Balanced', color: 'green' };
}
