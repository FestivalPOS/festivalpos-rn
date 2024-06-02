import { Product } from './Product';

export interface POSData {
  id: string;
  name: string;
  festival: string;
  save_sales: boolean;
  url: string;
  products: Product[];
}

export interface POSContextType {
  pos: POSData;
  loading: boolean;
  updateURL: (newURL: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  logoutPOS: () => Promise<void>;
}
