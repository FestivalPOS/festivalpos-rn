import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

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
    const savedUrl = await AsyncStorage.getItem('productUrl');
    const response = await fetch(savedUrl); // Fetch data from the saved URL
    const products = await response.json(); // Parse response as JSON
    // Process products and download images
    const processedProducts = await Promise.all(products.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    }));
    // Save products to AsyncStorage
    await AsyncStorage.setItem('products', JSON.stringify(processedProducts));
    console.log(processedProducts)
    return processedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Handle error and return empty array
    return [];
  }
};
