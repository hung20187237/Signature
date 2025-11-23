// Theme configuration for styled-components
export const theme = {
    colors: {
        primary: '#4f46e5', // Indigo-600
        primaryHover: '#4338ca', // Indigo-700
        primaryLight: '#818cf8', // Indigo-400
        secondary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Grays
        gray50: '#f9fafb',
        gray100: '#f3f4f6',
        gray200: '#e5e7eb',
        gray300: '#d1d5db',
        gray400: '#9ca3af',
        gray500: '#6b7280',
        gray600: '#4b5563',
        gray700: '#374151',
        gray800: '#1f2937',
        gray900: '#111827',

        // Text
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        textDisabled: '#9ca3af',

        // Background
        bgPrimary: '#ffffff',
        bgSecondary: '#f9fafb',
        bgTertiary: '#f3f4f6',

        // Border
        border: '#e5e7eb',
        borderLight: '#f3f4f6',
        borderDark: '#d1d5db',
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },

    borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '30px',
            '4xl': '36px',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            black: 900,
        },
    },

    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '500ms ease-in-out',
    },

    breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
};

export default theme;
