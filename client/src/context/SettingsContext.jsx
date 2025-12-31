import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('JPY');
    const [currencySymbol, setCurrencySymbol] = useState('¥');
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('/api/settings/public');
                setSettings(data);

                // Set currency
                if (data['localization.currency']) {
                    const curr = data['localization.currency'];
                    setCurrency(curr);
                    switch (curr) {
                        case 'USD': setCurrencySymbol('$'); break;
                        case 'VND': setCurrencySymbol('₫'); break;
                        case 'EUR': setCurrencySymbol('€'); break;
                        default: setCurrencySymbol('¥');
                    }
                }

                // Set language
                if (data['localization.default_language']) {
                    setLanguage(data['localization.default_language']);
                }
            } catch (error) {
                console.error('Failed to load settings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Simple Translation Dictionary
    const translations = {
        en: {
            'region.global': 'Global',
            'region.vietnam': 'Vietnam',
            'region.japan': 'Japan',
        },
        vi: {
            'region.global': 'Toàn cầu',
            'region.vietnam': 'Việt Nam',
            'region.japan': 'Nhật Bản',
        },
        ja: {
            'region.global': 'グローバル',
            'region.vietnam': 'ベトナム',
            'region.japan': '日本',
        }
    };

    const t = (key) => {
        const langDict = translations[language] || translations['en'];
        return langDict[key] || key;
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '';

        const localeMap = {
            'JPY': 'ja-JP',
            'USD': 'en-US',
            'VND': 'vi-VN'
        };

        try {
            return new Intl.NumberFormat(localeMap[currency] || 'ja-JP', {
                style: 'currency',
                currency: currency
            }).format(amount);
        } catch (e) {
            return `${currencySymbol}${amount}`;
        }
    };

    const value = {
        settings,
        loading,
        currency,
        currencySymbol,
        language,
        t,
        formatCurrency
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
