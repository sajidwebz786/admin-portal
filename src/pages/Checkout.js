import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { cartService, orderService, paymentService } from '../services/api';
import { authService } from '../services/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      if (user) {
        const response = await cartService.getByUserId(user.id);
        setCartItems(response.data);
      }
    } catch (error) {
      setError('Failed to load cart items');
      console.error('Cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      fetchCartItems();
    } catch (error) {
      setError('Failed to remove item from cart');
      console.error('Remove error:', error);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartService.updateCartItem(cartItemId, { quantity: newQuantity });
      fetchCartItems();
    } catch (error) {
      setError('Failed to update quantity');
      console.error('Update error:', error);
    }
  };

  const handleProceedToPayment = () => {
    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      const user = authService.getCurrentUser();

      // Create order for each cart item
      for (const item of cartItems) {
        await orderService.create({
          userId: user.id,
          packId: item.packId,
          quantity: item.quantity,
          deliveryAddress: deliveryAddress
        });
      }

      // Clear cart
      for (const item of cartItems) {
        await cartService.removeFromCart(item.id);
      }

      alert('Order placed successfully!');
      setShowPaymentModal(false);
      setCartItems([]);
    } catch (error) {
      setError('Failed to process payment');
      console.error('Payment error:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Redirect if not authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner" style={{ margin: '50px auto' }}></div>
              <p>Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="container-fluid">
        {/* Page Header */}
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>Checkout</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Checkout</li>
            </ol>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger alert-dismissible">
                <button
                  type="button"
                  className="close"
                  onClick={() => setError('')}
                >
                  ×
                </button>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Cart Items</h3>
              </div>
              <div className="card-body">
                {cartItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p>Your cart is empty. Add some packs to get started!</p>
                    <a href="/packs" className="btn btn-primary">
                      Browse Packs
                    </a>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Pack Name</th>
                          <th>Category</th>
                          <th>Pack Type</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.Pack?.name}</td>
                            <td>{item.Pack?.Category?.name}</td>
                            <td>{item.Pack?.PackType?.name}</td>
                            <td>
                              <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                <div className="input-group-prepend">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  readOnly
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>₹{item.unitPrice}</td>
                            <td>₹{item.totalPrice}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <i className="fas fa-trash"></i> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {cartItems.length > 0 && (
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Delivery Address</h3>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="deliveryAddress">Address *</label>
                    <textarea
                      className="form-control"
                      id="deliveryAddress"
                      rows="3"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>₹{calculateTotal()}</strong>
                  </div>
                  <button
                    className="btn btn-success btn-block mt-3"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Payment Method</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Select Payment Method</label>
                    <select
                      className="form-control"
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="net_banking">Net Banking</option>
                      <option value="wallet">Wallet</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>
                  <div className="text-center">
                    <p className="text-muted">Total Amount: ₹{calculateTotal()}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handlePayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </div>
  );
};

export default Checkout;