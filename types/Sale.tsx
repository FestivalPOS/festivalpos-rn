// Define the structure of a complete sale
export interface Sale {
  id: string;
  vendorPointId: string;
  saleDate: Date;
  saleItems: SaleItem[];
}

// Define the structure of a sale item
export interface SaleItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
}

// Define the context type
export interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Sale, apiUrl: string) => void;
  clearSale: (saleId: string) => void;
}
