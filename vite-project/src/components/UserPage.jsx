import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';
import { Link } from 'react-router-dom'; // Import the Link component

function UserPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const apiUrl = 'https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products';

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []);

  // Function to add a product to the cart
  const addToCart = (productId) => {
    const productToAdd = products.find((product) => product.id === productId);
    setCart([...cart, { ...productToAdd, quantity: 1 }]);
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  // Function to increment the quantity of a product in the cart
  const incrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  // Function to decrement the quantity of a product in the cart
  const decrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  // Function to calculate the total cost of products in the cart
  const calculateTotalCost = () => {
    return cart.reduce((total, item) => total + item.fields.price?.doubleValue * item.quantity, 0);
  };

  // Function to make a purchase (placeholder)
  const makePurchase = () => {
    // Implement your purchase logic here
    // For example, send a request to a payment gateway
    console.log('Purchase completed');
    setCart([]); // Clear the cart after the purchase
  };

  return (
    <div className="user-page">
      <h1>Digital Genie</h1>
      <div className="product-list">
        <ul>
          {products.map((product) => (
            <div className="product-item" key={product.id}>
              <div className="product-details">
                <img
                  src={product.fields.imageUrl?.stringValue}
                  alt={product.fields.productname?.stringValue}
                  className="product-image"
                />
                <strong>{product.fields.productname?.stringValue}</strong>
                <p>Description: {product.fields.description?.stringValue}</p>
                <p>Price: ₹{product.fields.price?.doubleValue}</p>
                <p>Stock: {product.fields.stock?.integerValue}</p>
                <div className="product-buttons">
                  <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div className="cart">
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <div className="cart-item">
                <img
                  src={item.fields.imageUrl?.stringValue}
                  alt={item.fields.productname?.stringValue}
                  className="cart-product-image"
                />
                {item.fields.productname?.stringValue}
                <div className="cart-quantity">
                  <button onClick={() => decrementQuantity(item.id)}>-</button>
                  {item.quantity}
                  <button onClick={() => incrementQuantity(item.id)}>+</button>
                </div>
                <p>Price: ₹{item.fields.price?.doubleValue * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
        {cart.length > 0 && (
          <div>
            <p><strong>Total Cost: ₹{calculateTotalCost()}</strong></p>
            <Link to="/cart">View Cart</Link> {/* Use the Link component to navigate to the cart page */}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
