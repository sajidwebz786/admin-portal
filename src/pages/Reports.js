import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

const Reports = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Revenue and sales analysis',
      icon: 'fas fa-chart-line',
      color: '#28a745'
    },
    {
      id: 'orders',
      title: 'Order Report',
      description: 'Order status and trends',
      icon: 'fas fa-shopping-cart',
      color: '#007bff'
    },
    {
      id: 'customers',
      title: 'Customer Report',
      description: 'Customer registration and activity',
      icon: 'fas fa-users',
      color: '#6f42c1'
    },
    {
      id: 'products',
      title: 'Product Report',
      description: 'Product performance and inventory',
      icon: 'fas fa-box',
      color: '#fd7e14'
    },
    {
      id: 'payments',
      title: 'Payment Report',
      description: 'Payment methods and transactions',
      icon: 'fas fa-credit-card',
      color: '#20c997'
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels and alerts',
      icon: 'fas fa-warehouse',
      color: '#dc3545'
    }
  ];

  const handleReportClick = (report) => {
    setCurrentReport(report);
    setShowModal(true);
  };

  const generateReport = async (params) => {
    setLoading(true);
    try {
      // Mock data generation - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockData = generateMockData(currentReport.id, params);
      setReportData(mockData);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (reportType, params) => {
    switch (reportType) {
      case 'sales':
        return {
          title: 'Sales Report',
          period: `${params.startDate} to ${params.endDate}`,
          summary: {
            totalRevenue: 125000,
            totalOrders: 450,
            averageOrderValue: 278,
            topCategory: 'Fruits'
          },
          data: [
            { date: '2024-01-01', revenue: 2500, orders: 12 },
            { date: '2024-01-02', revenue: 3200, orders: 15 },
            // More data...
          ]
        };
      case 'orders':
        return {
          title: 'Order Report',
          period: `${params.startDate} to ${params.endDate}`,
          summary: {
            totalOrders: 450,
            pendingOrders: 23,
            completedOrders: 412,
            cancelledOrders: 15
          },
          data: [
            { status: 'Completed', count: 412, percentage: 91.6 },
            { status: 'Pending', count: 23, percentage: 5.1 },
            { status: 'Cancelled', count: 15, percentage: 3.3 }
          ]
        };
      default:
        return { title: 'Report', data: [] };
    }
  };

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="content">
      <div className="container-fluid">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '12px',
              padding: '30px 20px',
              border: '1px solid #dee2e6',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                color: '#6c757d',
                marginBottom: '15px'
              }}>
                <i className="fas fa-chart-bar"></i>
              </div>
              <h1 style={{
                fontWeight: '600',
                fontSize: '2rem',
                marginBottom: '8px',
                color: '#495057'
              }}>
                Reports & Analytics
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#6c757d',
                marginBottom: '0',
                fontWeight: '400'
              }}>
                Generate comprehensive reports for your business insights
              </p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="row justify-content-center">
          {reports.map((report) => (
            <div key={report.id} className="col-md-6 col-lg-4 mb-4 d-flex align-items-stretch">
              <div
                className="card w-100"
                style={{
                  border: 'none',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                }}
                onClick={() => handleReportClick(report)}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-4">
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${report.color} 0%, ${report.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      color: 'white',
                      fontSize: '26px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <i className={report.icon}></i>
                  </div>
                  <h5
                    className="card-title mb-2"
                    style={{
                      fontWeight: '600',
                      color: '#495057',
                      fontSize: '1.1rem',
                      marginBottom: '10px'
                    }}
                  >
                    {report.title}
                  </h5>
                  <p
                    className="card-text text-muted mb-3"
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      flexGrow: '1'
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    className="btn btn-primary mt-auto"
                    style={{
                      borderRadius: '25px',
                      padding: '8px 25px',
                      background: report.color,
                      border: 'none',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="fas fa-chart-bar mr-2"></i>
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Modal */}
        {showModal && currentReport && (
          <>
            <div className="modal fade show" style={{ display: 'block' }}>
              <div className="modal-dialog modal-xl" style={{ maxWidth: '90%', margin: '2rem auto' }}>
                <div
                  className="modal-content"
                  style={{
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className="modal-header"
                    style={{
                      background: `linear-gradient(135deg, ${currentReport.color} 0%, ${currentReport.color}dd 100%)`,
                      color: 'white',
                      borderBottom: 'none',
                      padding: '20px 60px 20px 30px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <h5 className="modal-title" style={{ fontWeight: '600', margin: 0, flex: 1, fontSize: '1.25rem' }}>
                      <i className={`${currentReport.icon} mr-2`}></i>
                      {currentReport.title}
                    </h5>
                    <button
                      type="button"
                      className="close"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '20px',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: '0.9',
                        padding: '5px',
                        lineHeight: '1',
                        zIndex: 10
                      }}
                      onClick={() => {
                        setShowModal(false);
                        setReportData(null);
                      }}
                      onMouseOver={(e) => e.target.style.opacity = '1'}
                      onMouseOut={(e) => e.target.style.opacity = '0.9'}
                    >
                      ×
                    </button>
                  </div>

                  <div
                    className="modal-body"
                    style={{
                      padding: '40px',
                      background: '#f8f9fa',
                      maxHeight: '70vh',
                      overflowY: 'auto'
                    }}
                  >
                    {!reportData ? (
                      <ReportParameters
                        reportType={currentReport.id}
                        onGenerate={generateReport}
                        loading={loading}
                      />
                    ) : (
                      <ReportResults data={reportData} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal-backdrop fade show"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};

// Report Parameters Component
const ReportParameters = ({ reportType, onGenerate, loading }) => {
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    category: '',
    status: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(params);
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h5 style={{ color: '#495057', fontWeight: '600', marginBottom: '5px' }}>
          Report Parameters
        </h5>
        <p className="text-muted mb-4">Configure the parameters for your report</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label
                style={{
                  fontWeight: '600',
                  color: '#495057',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ced4da',
                  padding: '12px 15px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease'
                }}
                value={params.startDate}
                onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label
                style={{
                  fontWeight: '600',
                  color: '#495057',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ced4da',
                  padding: '12px 15px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease'
                }}
                value={params.endDate}
                onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {(reportType === 'sales' || reportType === 'products') && (
          <div className="form-group mb-3">
            <label
              style={{
                fontWeight: '600',
                color: '#495057',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              <i className="fas fa-tags mr-2"></i>
              Category (Optional)
            </label>
            <select
              className="form-control"
              style={{
                borderRadius: '8px',
                border: '1px solid #ced4da',
                padding: '12px 15px',
                fontSize: '14px'
              }}
              value={params.category}
              onChange={(e) => setParams({ ...params, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
            </select>
          </div>
        )}

        {reportType === 'orders' && (
          <div className="form-group mb-3">
            <label
              style={{
                fontWeight: '600',
                color: '#495057',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              <i className="fas fa-info-circle mr-2"></i>
              Order Status (Optional)
            </label>
            <select
              className="form-control"
              style={{
                borderRadius: '8px',
                border: '1px solid #ced4da',
                padding: '12px 15px',
                fontSize: '14px'
              }}
              value={params.status}
              onChange={(e) => setParams({ ...params, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{
              borderRadius: '25px',
              padding: '12px 40px',
              fontWeight: '600',
              fontSize: '16px',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating Report...
              </>
            ) : (
              <>
                <i className="fas fa-chart-bar mr-2"></i>
                Generate Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Report Results Component
const ReportResults = ({ data }) => {
  return (
    <div>
      <div className="text-center mb-4">
        <h5 style={{ color: '#495057', fontWeight: '700', marginBottom: '8px', fontSize: '1.25rem' }}>
          {data.title}
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: '16px' }}>
          <i className="fas fa-calendar mr-2"></i>
          Period: {data.period}
        </p>
      </div>

      {data.summary && (
        <div className="row mb-4 justify-content-center">
          {Object.entries(data.summary).map(([key, value]) => (
            <div key={key} className="col-md-6 col-lg-3 mb-3">
              <div
                className="card text-center h-100"
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body d-flex flex-column justify-content-center p-3">
                  <div style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '10px' }}>
                    {key.includes('Revenue') && <i className="fas fa-rupee-sign"></i>}
                    {key.includes('Orders') && <i className="fas fa-shopping-cart"></i>}
                    {key.includes('Value') && <i className="fas fa-calculator"></i>}
                    {key.includes('Category') && <i className="fas fa-tag"></i>}
                  </div>
                  <h6
                    className="card-title text-muted mb-2"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h6>
                  <h4
                    className="card-text mb-0"
                    style={{
                      color: '#007bff',
                      fontWeight: '700',
                      fontSize: '1.25rem'
                    }}
                  >
                    {typeof value === 'number' && key.includes('Revenue') ? `₹${value.toLocaleString()}` : value}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ border: 'none', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <div className="card-header" style={{ background: '#f8f9fa', borderBottom: 'none', borderRadius: '12px 12px 0 0' }}>
          <h6 className="mb-0" style={{ fontWeight: '600', color: '#495057', fontSize: '0.9rem' }}>
            <i className="fas fa-table mr-2"></i>
            Detailed Data
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <tr>
                  {data.data.length > 0 && Object.keys(data.data[0]).map(key => (
                    <th
                      key={key}
                      style={{
                        fontWeight: '600',
                        color: '#495057',
                        border: 'none',
                        padding: '15px',
                        textTransform: 'capitalize',
                        fontSize: '0.8rem'
                      }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        style={{
                          padding: '12px 15px',
                          verticalAlign: 'middle',
                          color: '#495057'
                        }}
                      >
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-success mr-3"
          style={{
            borderRadius: '25px',
            padding: '10px 25px',
            fontWeight: '600',
            border: 'none',
            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(40, 167, 69, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
          }}
        >
          <i className="fas fa-download mr-2"></i>
          Export PDF
        </button>
        <button
          className="btn btn-info"
          style={{
            borderRadius: '25px',
            padding: '10px 25px',
            fontWeight: '600',
            border: 'none',
            boxShadow: '0 4px 8px rgba(23, 162, 184, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(23, 162, 184, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(23, 162, 184, 0.3)';
          }}
        >
          <i className="fas fa-file-excel mr-2"></i>
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;