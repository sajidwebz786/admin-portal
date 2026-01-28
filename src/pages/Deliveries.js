import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { deliveryService } from '../services/api';
import { authService } from '../services/api';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getAll();
      setDeliveries(response.data);
    } catch (error) {
      setError('Failed to load deliveries');
      console.error('Deliveries error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await deliveryService.updateStatus(deliveryId, newStatus);
      fetchDeliveries();
    } catch (error) {
      setError('Failed to update delivery status');
      console.error('Status update error:', error);
    }
  };

  const handleAssignDelivery = async (orderId, deliveryPersonId) => {
    try {
      await deliveryService.assignDelivery(orderId, deliveryPersonId);
      fetchDeliveries();
    } catch (error) {
      setError('Failed to assign delivery');
      console.error('Assignment error:', error);
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
              <p>Loading deliveries...</p>
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
            <h1>Deliveries</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active">Deliveries</li>
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

        {/* Delivery Statistics */}
        <div className="row">
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Total Deliveries</span>
                <span className="info-box-number">{deliveries.length}</span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Pending</span>
                <span className="info-box-number">
                  {deliveries.filter((d) => d.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">In Transit</span>
                <span className="info-box-number">
                  {deliveries.filter((d) => d.status === 'in_transit').length}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-box bg-light">
              <div className="info-box-content">
                <span className="info-box-text">Delivered</span>
                <span className="info-box-number">
                  {deliveries.filter((d) => d.status === 'delivered').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Delivery Details</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Delivery ID</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Delivery Person</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No deliveries found. Deliveries will appear here when orders are placed.
                          </td>
                        </tr>
                      ) : (
                        deliveries.map((delivery) => (
                          <tr key={delivery.id}>
                            <td>#{delivery.id}</td>
                            <td>#{delivery.orderId || 'N/A'}</td>
                            <td>{delivery.customerName || 'N/A'}</td>
                            <td>{delivery.deliveryPerson || 'Not Assigned'}</td>
                            <td>
                              {delivery.address
                                ? delivery.address.substring(0, 30) + '...'
                                : 'N/A'}
                            </td>
                            <td>
                              <select
                                className="form-control form-control-sm"
                                value={delivery.status || 'pending'}
                                onChange={(e) =>
                                  handleStatusUpdate(delivery.id, e.target.value)
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="failed">Failed</option>
                              </select>
                            </td>
                            <td>
                              {delivery.createdAt
                                ? new Date(delivery.createdAt).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-info mr-2">
                                <i className="fas fa-eye"></i> View
                              </button>
                              <button className="btn btn-sm btn-success">
                                <i className="fas fa-user-plus"></i> Assign
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

export default Deliveries;