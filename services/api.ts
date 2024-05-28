import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { validatePOSData } from '../validators/POSData.validation'
import { POSData } from '../types/POSData';

export const fetchPOS = async (url) => {
  try {
    let response;
    // Fetch data from the network using the saved URL
    try {
      response = await fetch(url);
    } catch {
      throw new Error('Could not reach server.')
    }

    const posData: POSData = await response.json();
    
    // Validate JSON data against the schema
    if (!validatePOSData(posData)) {
        throw new Error('Validation failed for the fetched data.');
    }

    // Load icons
    /* posData.products = await Promise.all(posData.products.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    })); */

    return posData;
  } catch (error) {
    console.error(error);
    throw error;
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