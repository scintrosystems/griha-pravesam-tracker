import React from 'react';
import { calculateSectionExpenses, calculateOverallExpenses } from '../utils/expenseCalculations';

export default function SectionExpenseBar({ items, tabSlug, tabs, tabLabel }) {
  const sectionStats = calculateSectionExpenses(items, tabSlug);
  const overall = calculateOverallExpenses(items, tabs);

  const budgetSharePct = overall.grandTotal > 0
    ? ((sectionStats.total / overall.grandTotal) * 100).toFixed(1)
    : 0;

  return (
    <div className="custom-card p-2.5 mb-2.5 bg-white border d-flex flex-wrap align-items-center justify-content-between gap-2 shadow-xs">
      <div className="d-flex align-items-center gap-2">
        <div className="rounded-circle p-1.5 bg-amber-subtle text-amber d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
          <i className="bi bi-wallet2 fs-6"></i>
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

      {/* Amount & Percentage Stats */}
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div>
          <span className="text-muted small d-block" style={{ fontSize: '10px' }}>Total Cost</span>
          <span className="fw-bold text-dark">₹{sectionStats.total.toLocaleString('en-IN')}</span>
        </div>

        <div className="border-start ps-3">
          <span className="text-muted small d-block" style={{ fontSize: '10px' }}>Paid ({sectionStats.paidPct}%)</span>
          <span className="fw-bold text-success">₹{sectionStats.paid += 0 ? sectionStats.paid.toLocaleString('en-IN') : 0}</span>
        </div>

        <div className="border-start ps-3">
          <span className="text-muted small d-block" style={{ fontSize: '10px' }}>Balance Due</span>
          <span className={`fw-bold ${sectionStats.balance > 0 ? 'text-danger' : 'text-secondary'}`}>
            ₹{sectionStats.balance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}