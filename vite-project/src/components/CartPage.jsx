import React from 'react';
function CartPage({ cart, removeFromCart, incrementQuantity, decrementQuantity, calculateTotalCost }) {
  return (
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
          <button onClick={makePurchase}>Purchase</button>
        </div>
      )}
    </div>
  );
}
export default CartPage;