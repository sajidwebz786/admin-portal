import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { authService } from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAll();
      setPayments(response.data);
    } catch (error) {
      setError('Failed to load payments');
      console.error('Payments error:', error);
    } finally {
      setLoading(false);
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
              <p>Loading payments...</p>
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
            <h1>Payments</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active">Payments</li>
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

        {/* Payment Statistics */}
        <div className="row">
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Total Payments</span>
                <span className="info-box-number">{payments.length}</span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Successful</span>
                <span className="info-box-number">
                  {payments.filter((p) => p.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Pending</span>
                <span className="info-box-number">
                  {payments.filter((p) => p.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Failed</span>
                <span className="info-box-number">
                  {payments.filter((p) => p.status === 'failed').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Payment Details</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No payments found. Payments will appear here when customers make them.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id}>
                            <td>#{payment.id}</td>
                            <td>#{payment.orderId || 'N/A'}</td>
                            <td>{payment.customerName || 'N/A'}</td>
                            <td>₹{payment.amount || 0}</td>
                            <td>
                              <span className="badge badge-info">
                                {payment.method || 'Online'}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  payment.status === 'completed'
                                    ? 'badge-success'
                                    : payment.status === 'failed'
                                    ? 'badge-danger'
                                    : 'badge-warning'
                                }`}
                              >
                                {payment.status || 'Pending'}
                              </span>
                            </td>
                            <td>
                              {payment.createdAt
                                ? new Date(payment.createdAt).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-info">
                                <i className="fas fa-eye"></i> View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;