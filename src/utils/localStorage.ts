export const getStorageItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

export const setStorageItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
};

export const removeStorageItem = (key: string): void => {
    localStorage.removeItem(key);
};

export const STORAGE_KEYS = {
    USERS: 'smart_tech_users',
    PRODUCTS: 'smart_tech_products',
    CART: 'smart_tech_cart',
    ORDERS: 'smart_tech_orders',
    CURRENT_USER: 'smart_tech_current_user',
    ADMIN: 'smart_tech_admin',
};
