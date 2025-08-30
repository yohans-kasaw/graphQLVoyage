import { gql } from '@apollo/client';

export const WAREHOUSES_QUERY = gql`
  query Warehouses {
    warehouses {
      code
      name
    }
  }
`;

export const PRODUCTS_QUERY = gql`
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
