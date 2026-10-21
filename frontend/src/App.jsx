import { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [dateBorrowed, setDateBorrowed] = useState('');

  // Active Tab State
  const [activeTab, setActiveTab] = useState('records');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // 🚨 Custom Confirmation Modal State
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = 'http://localhost:5000/api/equipment';

  // Fetch borrowing records
  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Form Submission (Add Log)
  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!itemName || !borrowerName || !dateBorrowed) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, borrowerName, dateBorrowed })
      });

      if (response.ok) {
        setItemName('');
        setBorrowerName('');
        setDateBorrowed('');
        fetchItems();
        setActiveTab('records');
      }
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  // Mark equipment as Returned
  const handleReturn = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/return`, {
        method: 'PATCH'
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Trigger Modal
  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  // Execute Delete from Modal
  const handleExecuteDelete = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(`${API_URL}/${deletingId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setDeletingId(null); // Close modal
    }
  };

  // Filter and Search Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.borrowerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary Metrics Calculations
  const totalCount = items.length;
  const activeLoansCount = items.filter(item => item.status === 'Borrowed').length;
  const returnedCount = items.filter(item => item.status === 'Returned').length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      boxSizing: 'border-box',
      paddingBottom: '50px'
    }}>
      
      {/* 🏛️ Official Institutional Header */}
      <header style={{
        backgroundColor: '#064e3b',
        color: '#ffffff',
        borderBottom: '4px solid #10b981',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '1050px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              backgroundColor: '#022c22',
              border: '2px solid #34d399',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              🏫
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                CAMPUS LABORATORY MANAGEMENT SYSTEM
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#a7f3d0', fontWeight: '500' }}>
                College of Information Technology & Sciences • Equipment Tracking Portal
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              backgroundColor: '#022c22',
              color: '#34d399',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              border: '1px solid #047857'
            }}>
              ● System Status: Online
            </span>
          </div>
        </div>
      </header>

      {/* 📄 Main Content Container */}
      <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 24px' }}>

        {/* 🌟 Navigation Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#e2e8f0',
            padding: '4px',
            borderRadius: '10px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <button
              onClick={() => setActiveTab('records')}
              style={{
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'records' ? '#065f46' : 'transparent',
                color: activeTab === 'records' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'records' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Logged Records ({totalCount})
            </button>

            <button
              onClick={() => setActiveTab('new')}
              style={{
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'new' ? '#065f46' : 'transparent',
                color: activeTab === 'new' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'new' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              + Register New Loan
            </button>
          </div>

          <div style={{
            fontSize: '0.8rem',
            color: '#065f46',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '8px 14px',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            🔒 Secure Lab Access
          </div>
        </div>

        {/* 📊 TAB 1: RECORDS DASHBOARD */}
        {activeTab === 'records' && (
          <div>
            {/* Metrics Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={schoolMetricCard}>
                <span style={metricLabel}>Total Equipment Logs</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{totalCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Cumulative total in database</span>
              </div>

              <div style={{ ...schoolMetricCard, borderTop: '4px solid #d97706' }}>
                <span style={{ ...metricLabel, color: '#b45309' }}>Currently Borrowed</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{activeLoansCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px' }}>Items currently in use</span>
              </div>

              <div style={{ ...schoolMetricCard, borderTop: '4px solid #059669' }}>
                <span style={{ ...metricLabel, color: '#047857' }}>Successfully Returned</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>{returnedCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>Cleared and checked back in</span>
              </div>
            </div>

            {/* Table Section */}
            <div style={portalCardStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '16px',
                marginBottom: '20px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#065f46', margin: 0 }}>
                    Official Borrowing Ledger
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Real-time tracking of lab apparatus, meters, and equipment
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#065f46',
                    border: '1.5px solid #065f46',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🖨️ Print / Download Report
                </button>
              </div>

              {/* Filters */}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                backgroundColor: '#f8fafc',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ flex: '1 1 280px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Search Query
                  </label>
                  <input
                    type="text"
                    placeholder="Search by student/staff name or equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={schoolInputStyle}
                  />
                </div>

                <div style={{ flex: '0 1 180px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Status Filter
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={schoolInputStyle}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Borrowed">Active Loans Only</option>
                    <option value="Returned">Returned Only</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={schoolThStyle}>EQUIPMENT / ITEM</th>
                      <th style={schoolThStyle}>BORROWER NAME</th>
                      <th style={schoolThStyle}>DATE ISSUED</th>
                      <th style={schoolThStyle}>LOAN STATUS</th>
                      <th style={{ ...schoolThStyle, textAlign: 'center' }}>MANAGEMENT ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🔍</div>
                          No matching equipment records found in the ledger.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, index) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                          }}
                        >
                          <td style={{ ...schoolTdStyle, fontWeight: '700', color: '#0f172a' }}>
                            {item.itemName}
                          </td>
                          <td style={schoolTdStyle}>{item.borrowerName}</td>
                          <td style={schoolTdStyle}>{item.dateBorrowed}</td>
                          <td style={schoolTdStyle}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              letterSpacing: '0.03em',
                              display: 'inline-block',
                              backgroundColor: item.status === 'Returned' ? '#dcfce7' : '#fef3c7',
                              color: item.status === 'Returned' ? '#14532d' : '#78350f',
                              border: `1px solid ${item.status === 'Returned' ? '#86efac' : '#fde68a'}`
                            }}>
                              {item.status === 'Returned' ? '✓ RETURNED' : '⏳ BORROWED'}
                            </span>
                          </td>
                          <td style={{ ...schoolTdStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                              {item.status === 'Borrowed' && (
                                <button
                                  onClick={() => handleReturn(item.id)}
                                  style={{
                                    backgroundColor: '#059669',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '0.78rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Mark as Returned
                                </button>
                              )}
                              
                              <button
                                onClick={() => confirmDelete(item.id)}
                                style={{
                                  backgroundColor: '#fff1f2',
                                  color: '#be123c',
                                  border: '1.5px solid #fecdd3',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span>🗑️</span> Remove Log
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 📝 TAB 2: REGISTRATION FORM */}
        {activeTab === 'new' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={portalCardStyle}>
              <div style={{ borderBottom: '2px solid #ecfdf5', paddingBottom: '12px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#065f46', margin: 0 }}>
                  Equipment Requisition Form
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Please enter complete details to generate a digital loan slip.
                </p>
              </div>

              <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={formLabel}>Equipment Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Digital Oscilloscope 100MHz"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    style={schoolInputStyle}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Specify exact name or asset label tag on equipment.
                  </span>
                </div>

                <div>
                  <label style={formLabel}>Borrower's Full Name (Student / Faculty) *</label>
                  <input
                    type="text"
                    placeholder="e.g., Juan A. Dela Cruz"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    style={schoolInputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={formLabel}>Date Borrowed *</label>
                  <input
                    type="date"
                    value={dateBorrowed}
                    onChange={(e) => setDateBorrowed(e.target.value)}
                    style={schoolInputStyle}
                    required
                  />
                </div>

                <div style={{ paddingTop: '10px', display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '12px',
                      backgroundColor: '#065f46',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(6, 95, 70, 0.2)'
                    }}
                  >
                    ✓ Save & Authorize Loan
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('records')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* ⚠️ CUSTOM MODAL CONFIRMATION DIALOG */}
      {deletingId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 16px auto'
            }}>
              ⚠️
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              Confirm Record Deletion
            </h3>

            <p style={{ margin: '0 0 24px 0', fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5' }}>
              Are you sure you want to delete this borrowing record from the official log? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeletingId(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteDelete}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                }}
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Styling Constants
const portalCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const schoolMetricCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderTop: '4px solid #065f46',
  borderRadius: '8px',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
};

const metricLabel = {
  fontSize: '0.75rem',
  fontWeight: '800',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const formLabel = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '6px'
};

const schoolInputStyle = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: '#ffffff',
  border: '1.5px solid #cbd5e1',
  borderRadius: '6px',
  color: '#0f172a',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none'
};

const schoolThStyle = {
  padding: '12px 16px',
  fontSize: '0.75rem',
  fontWeight: '800',
  color: '#334155',
  letterSpacing: '0.05em'
};

const schoolTdStyle = {
  padding: '14px 16px',
  fontSize: '0.88rem',
  color: '#334155'
};

export default App;