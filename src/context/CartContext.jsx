import { createContext, useContext, useState, useEffect, useMemo } from 'react';

/**
 * CartContext — Manages shopping cart state.
 * Persists cart items in localStorage so they survive page refreshes.
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Restore cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('shopverse_cart');
        if (stored) {
            try {
                setCartItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem('shopverse_cart');
            }
        }
    }, []);

    // Persist cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('shopverse_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /** Add a product to the cart (or increment quantity if already present) */
    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    /** Remove a product from the cart entirely */
    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    /** Update the quantity of a specific item */
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    /** Clear all items from the cart */
    const clearCart = () => {
        setCartItems([]);
    };

    // Memoized computed values
    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    const cartCount = useMemo(
        () => cartItems.reduce((count, item) => count + item.quantity, 0),
        [cartItems]
    );

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

/** Custom hook for consuming cart context */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;
