import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPOS } from '../services/api';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
    id: string;
    name: string;
    price: number;
    tilecolor?: string;
    imageLocal?: string;
}

export interface POSData {
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

const POSContext = createContext<POSContextType | undefined>(undefined);

interface POSProviderProps {
    children: ReactNode;
}

export const POSProvider: React.FC<POSProviderProps> = ({ children }) => {
    const [pos, setPOS] = useState<POSData>({ name: '', url: '', products: [] });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const cachedPOS = JSON.parse(await AsyncStorage.getItem('pos'));
            if (cachedPOS) {
                setPOS(cachedPOS);
            } else {
                await fetchNewPOSData(pos);
            }
            setLoading(false);
        };
        
        loadInitialData();
    }, []);

    const savePOS = async (data: POSData) => {
        await AsyncStorage.setItem('pos', JSON.stringify(data));
        setPOS(data);
    };

    const fetchNewPOSData = async (currentPos: POSData) => {
        if (!currentPos.url) {
            console.log('No POS URL available, cannot fetch data');
            Toast.show({
                type: 'error',
                text1: 'No POS URL available',
                text2: 'Cannot fetch data',
                position: 'bottom'
            })
            return;
        }
        
        setLoading(true);
        try {
            const fetchedPOS = await fetchPOS(currentPos.url);
            await savePOS({ ...currentPos, name: fetchedPOS.name, products: fetchedPOS.products });
            Toast.show({
                type: 'success',
                text1: 'Loaded POS successfully',
                position: 'bottom'
            });
        } catch (error) {
            console.error('Error fetching POS data:', error);
            Toast.show({
                type: 'error',
                text1: 'Could not load POS data',
                position: 'bottom'
            })
        } finally {
            setLoading(false);
        }
    };

    const refreshPOSProducts = async (currentPos: POSData = pos) => {
        await savePOS({ ...currentPos, name: '', products: [] });
        fetchNewPOSData(currentPos);
    };

    const refreshProducts = async () => {
        setLoading(true);
        console.log('Refresh Products');
        await refreshPOSProducts();
        Toast.show({
            type: 'success',
            text1: 'POS refreshed',
            position: 'bottom'
        });
        setLoading(false);
    }

    const updateURL = async (newURL: string) => {
        const newPos = { url: newURL, name: '', products: [] };
        await savePOS(newPos);
        console.log('New POS URL added')
        refreshPOSProducts(newPos);
    };

    return (
        <POSContext.Provider value={{ pos, loading, updateURL, refreshProducts }}>
            {children}
        </POSContext.Provider>
    );
};

export const usePOS = (): POSContextType => {
    const context = useContext(POSContext);
    if (context === undefined) {
        throw new Error('usePOS must be used within a POSProvider');
    }
    return context;
};
