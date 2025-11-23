import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, selectedOptions = {}) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item._id === product._id &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Add new item
                return [...prevItems, {
                    ...product,
                    quantity,
                    selectedOptions,
                    cartItemId: `${product._id}-${Date.now()}`
                }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartItemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const openCart = () => {
        setIsCartOpen(true);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
