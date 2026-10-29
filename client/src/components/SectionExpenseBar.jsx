import React from 'react';
import './SectionExpenseBar.css';
import { calculateSectionExpenses, calculateOverallExpenses } from '../utils/expenseCalculations';

export default function SectionExpenseBar({ items, tabSlug, tabs, tabLabel }) {
  const sectionStats = calculateSectionExpenses(items, tabSlug);
  const overall = calculateOverallExpenses(items, tabs);

  const budgetSharePct = overall.grandTotal > 0
    ? ((sectionStats.total / overall.grandTotal) * 100).toFixed(1)
    : 0;

  return (
    <div className="section-expense-ribbon mb-2.5 d-flex flex-wrap align-items-center justify-content-between gap-2">
      {/* Left Info: Icon & Section Name */}
      <div className="d-flex align-items-center gap-2">
        <div className="section-expense-icon">
          <i className="bi bi-wallet2"></i>
        </div>
        <div>
          <span className="fw-bold small text-dark d-block">
            {tabLabel} Financials
          </span>
          <span className="text-muted" style={{ fontSize: '11px' }}>
            Consumes <strong>{budgetSharePct}%</strong> of overall budget
          </span>
        </div>
      </div>

      {/* Right Stats: Total, Paid & Balance */}
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="section-expense-stat">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value text-dark">₹{sectionStats.total.toLocaleString('en-IN')}</span>
        </div>

        <div className="section-expense-stat section-expense-divider">
          <span className="stat-label">Paid ({sectionStats.paidPct}%)</span>
          <span className="stat-value text-success">₹{sectionStats.paid.toLocaleString('en-IN')}</span>
        </div>

        <div className="section-expense-stat section-expense-divider">
          <span className="stat-label">Balance Due</span>
          <span className={`stat-value ${sectionStats.balance > 0 ? 'text-danger' : 'text-secondary'}`}>
            ₹{sectionStats.balance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}