import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { validatePOSData } from '../validators/POSData.validation'
import { POSData } from '../types/POSData';
import { Sale } from '../types/Sale';

export const fetchPOS = async (url) => {
  
  try {
    let response;
    // Fetch data from the network using the saved URL
    try {
      response = await fetch(url);
    } catch {
      throw new Error('errors.could_not_reach_server')
    }

    const posData: POSData = await response.json();
    
    // Validate JSON data against the schema
    if (!validatePOSData(posData)) {
        throw new Error('errors.validation_failed_for_fetched_data');
    }

    // Load icons
    /* posData.products = await Promise.all(posData.products.map(async (product) => {
      if (product.imageURL) {
        const localImage = await downloadImage(product.imageURL);
        return { ...product, imageLocal: localImage };
      }
      return product;
    })); */

    // Sort products
    posData.products = posData.products.sort((a, b) => a.order - b.order)

    return posData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSale = async (saleData: Sale, url: string) => {
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(saleData)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
  } catch (error) {
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