import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

export type POSData = {
  name: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    order: number;
    tilecolor?: string;
    imageLocal?: string;
  }>;
};

export const fetchPOS = async (url) => {
  try {
    // Fetch data from the network using the saved URL
    const response = await fetch(url);
    const pos = await response.json();

    // Process and cache the new products
    pos.products = await Promise.all(pos.products.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    }));

    return pos;
  } catch (error) {
    console.error('Error fetching products:', error);
    return Error;
  }
};

const downloadImage = async (url) => {
  const filename = url.split('/').pop();
  const path = `${FileSystem.documentDirectory}${filename}`;
  const { exists } = await FileSystem.getInfoAsync(path);
  if (!exists) {
    await FileSystem.downloadAsync(url, path);
  }
  return path;
};