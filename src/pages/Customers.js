import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '../services/api';
import { authService } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await userService.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      setError('Failed to load customers');
      console.error('Customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleToggleStatus = async (customerId) => {
    try {
      await userService.toggleStatus(customerId);
      fetchCustomers();
    } catch (error) {
      setError('Failed to update customer status');
      console.error('Status update error:', error);
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
              <p>Loading customers...</p>
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
            <h1>Customers</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active">Customers</li>
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

        {/* Customer Requests Section */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Customer Requests</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text">Total Customers</span>
                        <span className="info-box-number">{customers.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text">Active Customers</span>
                        <span className="info-box-number">
                          {customers.filter((c) => c.isActive).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text">New This Month</span>
                        <span className="info-box-number">
                          {customers.filter((c) => {
                            const createdDate = new Date(c.createdAt);
                            const now = new Date();
                            return (
                              createdDate.getMonth() === now.getMonth() &&
                              createdDate.getFullYear() === now.getFullYear()
                            );
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Customer Details</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <td>{customer.id}</td>
                          <td>{customer.name}</td>
                          <td>{customer.email}</td>
                          <td>{customer.phone || '-'}</td>
                          <td>
                            <span
                              className={`badge ${
                                customer.isActive
                                  ? 'badge-success'
                                  : 'badge-danger'
                              }`}
                            >
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-info mr-2"
                              onClick={() => handleViewDetails(customer)}
                            >
                              <i className="fas fa-eye"></i> View
                            </button>
                            <button
                              className={`btn btn-sm ${
                                customer.isActive ? 'btn-warning' : 'btn-success'
                              }`}
                              onClick={() => handleToggleStatus(customer.id)}
                            >
                              <i
                                className={`fas ${
                                  customer.isActive ? 'fa-ban' : 'fa-check'
                                }`}
                              ></i>
                              {customer.isActive ? ' Deactivate' : ' Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {customers.length === 0 && (
                  <div className="text-center py-4">
                    <p>No customers found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details Modal */}
        {showDetailsModal && selectedCustomer && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Customer Details</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Customer ID</label>
                        <p className="form-control-plaintext">
                          #{selectedCustomer.id}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name</label>
                        <p className="form-control-plaintext">
                          {selectedCustomer.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <p className="form-control-plaintext">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phone</label>
                        <p className="form-control-plaintext">
                          {selectedCustomer.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <p className="form-control-plaintext">
                          <span
                            className={`badge ${
                              selectedCustomer.isActive
                                ? 'badge-success'
                                : 'badge-danger'
                            }`}
                          >
                            {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Role</label>
                        <p className="form-control-plaintext">
                          {selectedCustomer.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Joined Date</label>
                        <p className="form-control-plaintext">
                          {new Date(
                            selectedCustomer.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Last Updated</label>
                        <p className="form-control-plaintext">
                          {new Date(
                            selectedCustomer.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional customer request information can be added here */}
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Recent Orders</label>
                        <p className="form-control-plaintext text-muted">
                          Order history will be displayed here (feature coming soon)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDetailsModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </div>
  );
};

export default Customers;