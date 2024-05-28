import { Product } from "./Product";

export interface POSData {
    id: string;
    name: string;
    url: string;
    products: Product[];
}

export interface POSContextType {
    pos: POSData;
    loading: boolean;
    updateURL: (newURL: string) => Promise<void>;
    refreshProducts: () => Promise<void>;
}