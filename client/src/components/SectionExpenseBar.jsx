import React from 'react';
import './SectionExpenseBar.css';
import { calculateSectionExpenses, calculateOverallExpenses, getNumericCost } from '../utils/expenseCalculations';

export default function SectionExpenseBar({ items = [], tabSlug, tabs = [], tabLabel }) {
  const sectionStats = calculateSectionExpenses(items, tabSlug);
  const overall = calculateOverallExpenses(items, tabs);

  const budgetSharePct = overall.grandTotal > 0
    ? ((sectionStats.total / overall.grandTotal) * 100).toFixed(1)
    : 0;

  const isPurchase = tabSlug === 'purchase' || tabSlug === 'shopping';

  // Calculate Poojai vs General breakdown for Purchase List
  let poojaiTotal = 0;
  let generalTotal = 0;

  if (isPurchase) {
    items.filter(i => i.tabSlug === tabSlug).forEach(item => {
      const cost = getNumericCost(item);
      if (item.category === 'General') {
        generalTotal += cost;
      } else {
        poojaiTotal += cost; // Defaults to Poojai
      }
    });
  }

  const poojaiPct = sectionStats.total > 0 ? Math.round((poojaiTotal / sectionStats.total) * 100) : 0;
  const generalPct = sectionStats.total > 0 ? (100 - poojaiPct) : 0;

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

      {/* Middle: Category-Wise Breakdown ONLY on Purchase List */}
      {isPurchase && sectionStats.total > 0 && (
        <div className="d-flex align-items-center gap-2 px-2 py-1 rounded border bg-light">
          <div className="small" style={{ fontSize: '11px' }}>
            <span className="text-amber fw-bold me-1">🪔 Poojai:</span>
            <strong>₹{poojaiTotal.toLocaleString('en-IN')}</strong> ({poojaiPct}%)
          </div>
          <span className="text-muted">|</span>
          <div className="small" style={{ fontSize: '11px' }}>
            <span className="text-primary fw-bold me-1">🛍️ General:</span>
            <strong>₹{generalTotal.toLocaleString('en-IN')}</strong> ({generalPct}%)
          </div>
        </div>
      )}

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