import React, { useState, useContext } from 'react';

// Create our theme context using React.CreateContext()
export const CartContext = React.createContext();

// Create a custom hook that allows easy access to our Cart values
export const useCart = () => useContext(CartContext);

// Creating our theme provider. Accepts an argument of "props", here we plucking off the "children" object.
export default function CartProvider({ children }) {
  
  // Creating our state
  const [cartItems, setCartItems] = useState([]);

  // Method to update our state
  const onAddToCart = (item) => {
    console.log('Adding to the Cart');
    setCartItems([...cartItems, item]);    
  };

  const onRemoveFromCart = (item) => {
    console.log('Remove from the Cart');
    setCartItems(cartItems.filter(cartItem => cartItem.title !== item.title));
  };

  // The provider component will wrap all other components inside of it that need access to our global state
  return (
    // Dark theme and toggle theme are getting provided to the child components
    <CartContext.Provider value={{ cartItems, onAddToCart, onRemoveFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
