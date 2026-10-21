import { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  
  // New State Fields for Enhanced Features
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [borrowerName, setBorrowerName] = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [dateBorrowed, setDateBorrowed] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');

  // Active Tab State (Modern Pill Navigation)
  const [activeTab, setActiveTab] = useState('records');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  // Handle Form Submission (Add Log with new fields)
  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!itemName || !borrowerName || !dateBorrowed || !dueDate) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemName, 
          category, 
          borrowerName, 
          courseSection, 
          dateBorrowed, 
          dueDate,
          remarks: remarks || 'Good condition'
        })
      });

      if (response.ok) {
        setItemName('');
        setCategory('Electronics');
        setBorrowerName('');
        setCourseSection('');
        setDateBorrowed('');
        setDueDate('');
        setRemarks('');
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

  // Delete Entry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this borrowing record from the official log?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  // Helper function to check if an active loan is overdue
  const isOverdue = (dueDateStr, status) => {
    if (status === 'Returned') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDateStr < today;
  };

  // Filter and Search Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.courseSection && item.courseSection.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'All' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary Metrics Calculations
  const totalCount = items.length;
  const activeLoansCount = items.filter(item => item.status === 'Borrowed').length;
  const overdueCount = items.filter(item => isOverdue(item.dueDate, item.status)).length;
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
          maxWidth: '1150px',
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
      <main style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 24px' }}>

        {/* 🌟 Modern Pill-Style Navigation Switcher */}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={schoolMetricCard}>
                <span style={metricLabel}>Total Logs</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{totalCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Cumulative total</span>
              </div>

              <div style={{ ...schoolMetricCard, borderTop: '4px solid #d97706' }}>
                <span style={{ ...metricLabel, color: '#b45309' }}>Active Loans</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{activeLoansCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px' }}>Items checked out</span>
              </div>

              <div style={{ ...schoolMetricCard, borderTop: '4px solid #dc2626' }}>
                <span style={{ ...metricLabel, color: '#991b1b' }}>Overdue Items</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626', marginTop: '4px' }}>{overdueCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '2px' }}>Past return deadline</span>
              </div>

              <div style={{ ...schoolMetricCard, borderTop: '4px solid #059669' }}>
                <span style={{ ...metricLabel, color: '#047857' }}>Returned</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>{returnedCount}</span>
                <span style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>Checked back in</span>
              </div>
            </div>

            {/* Table & Controls Section */}
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
                    Real-time tracking of lab apparatus, category tags, and due dates
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

              {/* Filters Bar */}
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
                    placeholder="Search equipment, borrower, or section..."
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

              {/* Official Table View */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={schoolThStyle}>EQUIPMENT / CATEGORY</th>
                      <th style={schoolThStyle}>BORROWER & SECTION</th>
                      <th style={schoolThStyle}>DATES (ISSUED / DUE)</th>
                      <th style={schoolThStyle}>STATUS & REMARKS</th>
                      <th style={{ ...schoolThStyle, textAlign: 'center' }}>ACTIONS</th>
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
                      filteredItems.map((item, index) => {
                        const itemOverdue = isOverdue(item.dueDate, item.status);
                        return (
                          <tr
                            key={item.id}
                            style={{
                              borderBottom: '1px solid #e2e8f0',
                              backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                            }}
                          >
                            <td style={schoolTdStyle}>
                              <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.itemName}</div>
                              <span style={{ fontSize: '0.72rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', color: '#475569' }}>
                                {item.category || 'General'}
                              </span>
                            </td>

                            <td style={schoolTdStyle}>
                              <div style={{ fontWeight: '600' }}>{item.borrowerName}</div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.courseSection || 'N/A'}</span>
                            </td>

                            <td style={schoolTdStyle}>
                              <div style={{ fontSize: '0.82rem' }}>Issued: {item.dateBorrowed}</div>
                              <div style={{ fontSize: '0.82rem', fontWeight: itemOverdue ? '700' : 'normal', color: itemOverdue ? '#dc2626' : '#64748b' }}>
                                Due: {item.dueDate || 'N/A'}
                              </div>
                            </td>

                            <td style={schoolTdStyle}>
                              <div style={{ marginBottom: '4px' }}>
                                {item.status === 'Returned' ? (
                                  <span style={returnedBadge}>✓ RETURNED</span>
                                ) : itemOverdue ? (
                                  <span style={overdueBadge}>⚠ OVERDUE</span>
                                ) : (
                                  <span style={borrowedBadge}>⏳ BORROWED</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                "{item.remarks || 'Standard condition'}"
                              </div>
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
                                      padding: '6px 10px',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Return
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  style={{
                                    backgroundColor: '#fff1f2',
                                    color: '#be123c',
                                    border: '1px solid #fecdd3',
                                    padding: '6px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 📝 TAB 2: NEW BORROWING REGISTRATION FORM */}
        {activeTab === 'new' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={portalCardStyle}>
              <div style={{ borderBottom: '2px solid #ecfdf5', paddingBottom: '12px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#065f46', margin: 0 }}>
                  Equipment Requisition Form
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Complete all required fields including category and due date deadline.
                </p>
              </div>

              <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={formLabel}>Equipment / Apparatus Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Digital Oscilloscope"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      style={schoolInputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={formLabel}>Equipment Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={schoolInputStyle}
                    >
                      <option value="Electronics">Electronics & Hardware</option>
                      <option value="Measuring Tools">Measuring Tools</option>
                      <option value="Glassware">Glassware & Chemistry</option>
                      <option value="IT Equipment">IT Equipment & Peripherals</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={formLabel}>Borrower's Full Name *</label>
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
                    <label style={formLabel}>Course & Section *</label>
                    <input
                      type="text"
                      placeholder="e.g., BSIT 3-A"
                      value={courseSection}
                      onChange={(e) => setCourseSection(e.target.value)}
                      style={schoolInputStyle}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

                  <div>
                    <label style={formLabel}>Expected Due Date *</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      style={schoolInputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={formLabel}>Condition Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g., Brand new, complete cables included"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={schoolInputStyle}
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
    </div>
  );
}

// 🎨 Institutional School Styling System & Badges
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
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
};

const metricLabel = {
  fontSize: '0.72rem',
  fontWeight: '800',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const formLabel = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '4px'
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
  padding: '12px 14px',
  fontSize: '0.72rem',
  fontWeight: '800',
  color: '#334155',
  letterSpacing: '0.05em'
};

const schoolTdStyle = {
  padding: '12px 14px',
  fontSize: '0.85rem',
  color: '#334155'
};

const returnedBadge = {
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '0.72rem',
  fontWeight: '800',
  backgroundColor: '#dcfce7',
  color: '#14532d',
  border: '1px solid #86efac',
  display: 'inline-block'
};

const borrowedBadge = {
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '0.72rem',
  fontWeight: '800',
  backgroundColor: '#fef3c7',
  color: '#78350f',
  border: '1px solid #fde68a',
  display: 'inline-block'
};

const overdueBadge = {
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '0.72rem',
  fontWeight: '800',
  backgroundColor: '#fee2e2',
  color: '#991b1b',
  border: '1px solid #fca5a5',
  display: 'inline-block'
};

export default App;