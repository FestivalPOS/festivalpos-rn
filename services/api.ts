import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

const downloadImage = async (url) => {
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
    // Try to fetch cached data first
    const cachedProducts = await AsyncStorage.getItem('products');
    if (cachedProducts) {
      console.log('Using cached products');
      return JSON.parse(cachedProducts);
    }
    
    // Fetch data from the network if no cache is available
    const savedUrl = await AsyncStorage.getItem('productUrl');
    const response = await fetch(savedUrl);
    const products = await response.json();

    // Process and cache the new products
    const processedProducts = await Promise.all(products.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    }));

    await AsyncStorage.setItem('products', JSON.stringify(processedProducts));
    return processedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Handle error and return empty array if no data is available at all
    Toast.show({
      type: 'error',
      text1: 'Server not reachable',
      text2: 'Using cached data if available',
      position: 'bottom'
    });
    const cachedProducts = await AsyncStorage.getItem('products');
    return cachedProducts ? JSON.parse(cachedProducts) : [];
  }
};


export const refreshProducts = async () => {
  await AsyncStorage.removeItem('products');
  return await fetchProducts();
}