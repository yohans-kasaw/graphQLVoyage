import type { Warehouse, Product } from './types';

// database
export const warehouses: Warehouse[] = [
  { code: 'BLR-A', name: 'Bengaluru Alpha', city: 'Bengaluru', country: 'India' },
  { code: 'PNQ-C', name: 'Pune Charlie', city: 'Pune', country: 'India' },
  { code: 'DEL-B', name: 'Delhi Bravo', city: 'New Delhi', country: 'India' }
];

export let products: Product[] = [
  { id: 'P-1001', name: '12mm Hex Bolt',  sku: 'HEX-12-100', warehouse: 'BLR-A', stock: 180, demand: 120 },
  { id: 'P-1002', name: 'Steel Washer',   sku: 'WSR-08-500', warehouse: 'BLR-A', stock: 50,  demand: 80  },
  { id: 'P-1003', name: 'M8 Nut',         sku: 'NUT-08-200', warehouse: 'PNQ-C', stock: 80,  demand: 80  },
  { id: 'P-1004', name: 'Bearing 608ZZ',  sku: 'BRG-608-50', warehouse: 'DEL-B', stock: 24,  demand: 120 }
];
