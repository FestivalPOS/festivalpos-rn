import React, { createContext, useContext, useState, useEffect, ReactNode, FunctionComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sale, SalesContextType } from '../types/Sale';
import { postSale } from '../services/api';
import BackgroundFetch from 'react-native-background-fetch';

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSales = (): SalesContextType => {
    const context = useContext(SalesContext);
    if (context === undefined) {
        throw new Error('useSales must be used within a SalesProvider');
    }
    return context;
};

interface SalesProviderProps {
    children: ReactNode;
}

const configureBackgroundFetch = async () => {
    // Configure background fetch
    BackgroundFetch.configure({
        minimumFetchInterval: 20, // <-- minutes, e.g., 20 minutes
        stopOnTerminate: false,  // Continue running after app termination
        startOnBoot: true,       // Start background service on device boot
        enableHeadless: true     // Enables headless task execution
    }, async (taskId) => {
        console.log('[BackgroundFetch] taskId: ', taskId);
        await retrySavedSales();
        BackgroundFetch.finish(taskId);
    }, (error) => {
        console.log('[BackgroundFetch] failed to start', error);
    });
};

const retrySavedSales = async () => {
    const savedSales = await AsyncStorage.getItem('salesToRetry');
    if (savedSales) {
        const salesToRetry: { sale: Sale; retryCount: number; api: string }[] = JSON.parse(savedSales);
        for (const saleData of salesToRetry) {
            if (saleData.retryCount >= 10) {
                console.log(`Removing sale after 10 retries: ${saleData.sale.id}`);
                continue;
            }
            const success = await postSale(saleData.sale, saleData.api);
            if (success) {
                salesToRetry.splice(salesToRetry.indexOf(saleData), 1);
            } else {
                saleData.retryCount += 1;
            }
        }
        await AsyncStorage.setItem('salesToRetry', JSON.stringify(salesToRetry));
    }
};

export const SalesProvider: FunctionComponent<SalesProviderProps> = ({ children }) => {
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        configureBackgroundFetch();
        return () => {
            BackgroundFetch.stop();
        };
    }, []);

    const addSale = async (sale: Sale, apiUrl: string) => {
        const currentSales = await AsyncStorage.getItem('salesToRetry');
        const salesToRetry = currentSales ? JSON.parse(currentSales) : [];
        salesToRetry.push({ sale, retryCount: 0, api: apiUrl });
        await AsyncStorage.setItem('salesToRetry', JSON.stringify(salesToRetry));

        setSales(currentSales => [...currentSales, sale]);
    };

    const clearSale = (saleId: string) => {
        setSales(currentSales => currentSales.filter(sale => sale.id !== saleId));
    };

    return (
        <SalesContext.Provider value={{ sales, addSale, clearSale }}>
            {children}
        </SalesContext.Provider>
    );
};
