// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const exampleProducts : Product[] = [
  { id: 1, name: 'Beer', price: 5.00},
  { id: 2, name: 'Soft Drink', price: 2.50 },
  { id: 3, name: 'Water', price: 1.00 },
  { id: 4, name: 'Wine', price: 7.50 },
  { id: 99, name: 'Depot', price: -2.00 },
];

const downloadImage = async (url:string) => {
  const filename = url.split('/').pop();
  const path = `${FileSystem.documentDirectory}${filename}`;
  const { exists } = await FileSystem.getInfoAsync(path);
  if (!exists) {
    await FileSystem.downloadAsync(url, path);
  }
  return path;
};

export const fetchProducts = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = await Promise.all(exampleProducts.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    }));
    await AsyncStorage.setItem('products', JSON.stringify(products));
    return products;
  } catch (error) {
    const products = await AsyncStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  }
};
