export type Product = {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
};

export type ProductStatus = {
  label: string;
  color: 'yellow' | 'green' | 'blue';
};

export type TransferInput = {
  id: string;
  from: string;
  to: string;
  qty: number;
};
