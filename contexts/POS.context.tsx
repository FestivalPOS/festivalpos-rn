import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPOS } from '../services/api';
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
            throw new Error('No URL available');
        }
        setLoading(true);
        try {
            const fetchedPOS = await fetchPOS(currentPos.url);
            await savePOS({ ...currentPos, name: fetchedPOS.name, products: fetchedPOS.products });
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshPOSProducts = async (currentPos: POSData = pos) => {
        await savePOS({ ...currentPos, name: '', products: [] });
        try {
            await fetchNewPOSData(currentPos);
        } catch (error) {
            throw error;
        }
    };

    const refreshProducts = async () => {
        setLoading(true);
        console.log('Refresh products');
        try {
            await refreshPOSProducts();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const updateURL = async (newURL: string) => {
        console.log('Update url and refresh')
        const newPos = { url: newURL, name: '', products: [] };
        await savePOS(newPos);
        try {
            await fetchNewPOSData(newPos);
        } catch (error) {
            throw error;
        }
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
