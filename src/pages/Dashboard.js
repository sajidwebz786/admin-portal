import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { categoryService, productService, userService, packService, orderService } from '../services/api';
import { authService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    customers: 0,
    packs: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [categoriesRes, productsRes, customersRes, packsRes, ordersRes] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
        userService.getCustomers(),
        packService.getAll(),
        orderService.getAll().catch(err => ({ data: [] })), // Handle errors gracefully
      ]);

      console.log('Dashboard data received:', {
        categories: categoriesRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        customers: customersRes.data?.length || 0,
        packs: packsRes.data?.length || 0,
        orders: ordersRes.data?.length || 0,
      });

      setStats({
        categories: categoriesRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        customers: customersRes.data?.length || 0,
        packs: packsRes.data?.length || 0,
        orders: ordersRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
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
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="modern-spinner"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Misty Floating Waves */}
      <div className="wave-1"></div>
      <div className="wave-2"></div>
      <div className="wave-3"></div>

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          {/* Error Alert */}
          {error && (
            <div className="row mb-4">
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

          {/* Stats Cards */}
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{stats.categories}</h3>
                  <p>Categories</p>
                </div>
                <div className="icon">
                  <i className="fas fa-th"></i>
                </div>
                <Link to="/categories" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{stats.products}</h3>
                  <p>Products</p>
                </div>
                <div className="icon">
                  <i className="fas fa-box"></i>
                </div>
                <Link to="/products" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{stats.packs}</h3>
                  <p>Packs</p>
                </div>
                <div className="icon">
                  <i className="fas fa-cubes"></i>
                </div>
                <Link to="/packs" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{stats.customers}</h3>
                  <p>Customers</p>
                </div>
                <div className="icon">
                  <i className="fas fa-users"></i>
                </div>
                <Link to="/customers" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{stats.orders}</h3>
                  <p>Orders</p>
                </div>
                <div className="icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <Link to="/orders" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-info">
                          <i className="fas fa-th"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Categories</span>
                          <span className="info-box-number">
                            Manage product categories
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-info" style={{ width: '70%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/categories" className="btn btn-info btn-sm">
                              Manage Categories
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-success">
                          <i className="fas fa-box"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Products</span>
                          <span className="info-box-number">
                            Add and update inventory
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/products" className="btn btn-success btn-sm">
                              Manage Products
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-warning">
                          <i className="fas fa-cubes"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Packs</span>
                          <span className="info-box-number">
                            Create product bundles
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/packs" className="btn btn-warning btn-sm">
                              Manage Packs
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-danger">
                          <i className="fas fa-users"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Customers</span>
                          <span className="info-box-number">
                            View customer data
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-danger" style={{ width: '90%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/customers" className="btn btn-danger btn-sm">
                              View Customers
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-primary">
                          <i className="fas fa-shopping-cart"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Orders</span>
                          <span className="info-box-number">
                            Track and manage orders
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/orders" className="btn btn-primary btn-sm">
                              Track Orders
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12">
                      <div className="info-box">
                        <span className="info-box-icon bg-secondary">
                          <i className="fas fa-chart-line"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Analytics</span>
                          <span className="info-box-number">
                            View business insights
                          </span>
                          <div className="progress">
                            <div className="progress-bar bg-secondary" style={{ width: '50%' }}></div>
                          </div>
                          <span className="progress-description">
                            <Link to="/payments" className="btn btn-secondary btn-sm">
                              View Analytics
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & System Status */}
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Activity</h3>
                </div>
                <div className="card-body">
                  <div className="timeline timeline-inverse">
                    <div className="time-label">
                      <span className="bg-danger">Today</span>
                    </div>
                    <div>
                      <i className="fas fa-user bg-primary"></i>
                      <div className="timeline-item">
                        <span className="time">
                          <i className="fas fa-clock"></i> Just now
                        </span>
                        <h3 className="timeline-header">
                          <a href="#">Admin</a> logged into the system
                        </h3>
                      </div>
                    </div>
                    <div>
                      <i className="fas fa-shopping-cart bg-success"></i>
                      <div className="timeline-item">
                        <span className="time">
                          <i className="fas fa-clock"></i> 2 minutes ago
                        </span>
                        <h3 className="timeline-header">
                          New order placed - Order #1234
                        </h3>
                      </div>
                    </div>
                    <div>
                      <i className="fas fa-box bg-warning"></i>
                      <div className="timeline-item">
                        <span className="time">
                          <i className="fas fa-clock"></i> 5 minutes ago
                        </span>
                        <h3 className="timeline-header">
                          Product inventory updated
                        </h3>
                      </div>
                    </div>
                    <div>
                      <i className="fas fa-clock bg-gray"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">System Status</h3>
                </div>
                <div className="card-body">
                  <div className="callout callout-success">
                    <h5>Server Status</h5>
                    <p>Online and running smoothly</p>
                  </div>
                  <div className="callout callout-info">
                    <h5>Database</h5>
                    <p>Connected and operational</p>
                  </div>
                  <div className="callout callout-warning">
                    <h5>API Status</h5>
                    <p>Active with normal response times</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;