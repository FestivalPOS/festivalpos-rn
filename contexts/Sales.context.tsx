import React, { createContext, useContext, useState, useEffect, ReactNode, FunctionComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sale, SalesContextType } from '../types/Sale';
import { postSale } from '../services/api';
import { Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

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

const BACKGROUND_FETCH_TASK = 'background-fetch-sales';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const savedSales = await AsyncStorage.getItem('salesToRetry');
    if (savedSales) {
        const salesToRetry = JSON.parse(savedSales);
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
        return BackgroundFetch.BackgroundFetchResult.NoData;
    } else {
        BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
});

const configureBackgroundFetch = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
        case BackgroundFetch.BackgroundFetchStatus.Denied:
            console.log("Background fetch is denied on this device.");
            return;
        case BackgroundFetch.BackgroundFetchStatus.Restricted:
            console.log("Background fetch is restricted on this device.");
            return;
        case BackgroundFetch.BackgroundFetchStatus.Available:
            console.log("Background fetch is allowed and enabled.");
            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
                minimumInterval: 30, // Fetch interval in minutes
                stopOnTerminate: false,
                startOnBoot: true
            });
            break;
        default:
            console.log("Unknown status for background fetch");
    }
};

export const SalesProvider: FunctionComponent<SalesProviderProps> = ({ children }) => {
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            configureBackgroundFetch();
        }
    }, [sales]);

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
