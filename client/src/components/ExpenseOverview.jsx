import React, { useState } from 'react';
import './ExpenseOverview.css';
import { calculateOverallExpenses } from '../utils/expenseCalculations';

export default function ExpenseOverview({ items, tabs }) {
    const [collapsed, setCollapsed] = useState(true);
    const data = calculateOverallExpenses(items, tabs);

    return (
        <div className="expense-overview-card mb-3">
            {/* Header with Collapse Toggle */}
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                    <div
                        className="rounded-circle bg-amber-subtle text-amber d-flex align-items-center justify-content-center shadow-xs"
                        style={{ width: '34px', height: '34px' }}
                    >
                        <i className="bi bi-cash-stack fs-6"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-0">Event Expenses & Budget Allocation</h6>
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                            Live calculations across all sections & budget share
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2.5 fw-semibold"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className={`bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'} me-1`}></i>
                    {collapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {!collapsed && (
                <>
                    {/* 1. Grand Stat Cards with Generous Padding */}
                    <div className="row g-2 g-sm-3 mb-3">
                        {/* Card 1: Total Budget */}
                        <div className="col-12 col-md-4">
                            <div className="financial-stat-card card-theme-total">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="stat-card-title">Grand Total Budget</span>
                                    <span className="badge bg-light text-dark border">100%</span>
                                </div>
                                <div>
                                    <h3 className="stat-card-value">
                                        ₹{data.grandTotal.toLocaleString('en-IN')}
                                    </h3>
                                    <p className="stat-card-footnote">Total committed expenses</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Paid / Settled */}
                        <div className="col-6 col-md-4">
                            <div className="financial-stat-card card-theme-paid">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="stat-card-title">Paid / Settled</span>
                                    <span className="stat-pill-badge bg-success text-white">
                                        {data.overallPaidPct}%
                                    </span>
                                </div>
                                <div>
                                    <h3 className="stat-card-value">
                                        ₹{data.grandPaid.toLocaleString('en-IN')}
                                    </h3>
                                    <p className="stat-card-footnote">Cash & advances given</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Balance to Settle */}
                        <div className="col-6 col-md-4">
                            <div className="financial-stat-card card-theme-balance">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="stat-card-title">Balance to Settle</span>
                                    <span className="stat-pill-badge bg-danger text-white">
                                        {data.overallBalancePct}%
                                    </span>
                                </div>
                                <div>
                                    <h3 className="stat-card-value">
                                        ₹{data.grandBalance.toLocaleString('en-IN')}
                                    </h3>
                                    <p className="stat-card-footnote">Remaining cash needed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Dual-Colored Settlement Progress Bar */}
                    <div className="p-2.5 rounded-3 border bg-light mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1.5" style={{ fontSize: '11px' }}>
                            <span>Settlement Progress: <strong className="text-success">{data.overallPaidPct}% Settled</strong></span>
                            <span>Remaining: <strong className="text-danger">{data.overallBalancePct}% Due</strong></span>
                        </div>
                        <div className="progress progress-container-settlement">
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${data.overallPaidPct}%` }}
                                title={`Paid: ${data.overallPaidPct}%`}
                            ></div>
                            <div
                                className="progress-bar bg-amber"
                                role="progressbar"
                                style={{ width: `${data.overallBalancePct}%` }}
                                title={`Balance: ${data.overallBalancePct}%`}
                            ></div>
                        </div>
                    </div>

                    {/* 3. Section-Wise Budget Allocation Breakdown */}
                    <div className="d-flex align-items-center gap-1.5 mb-2">
                        <i className="bi bi-pie-chart text-amber"></i>
                        <span className="fw-bold small text-dark">Section-Wise Budget Share (% of Total):</span>
                    </div>

                    <div className="row g-2">
                        {data.sectionBreakdown.map((sec) => (
                            <div key={sec.slug} className="col-12 col-md-6">
                                <div className="category-allocation-card d-flex flex-column gap-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold small text-dark d-flex align-items-center gap-1.5 text-truncate">
                                            <i className={`bi ${sec.icon}`} style={{ color: sec.color }}></i>
                                            <span className="text-truncate">{sec.label}</span>
                                        </span>
                                        <span className="badge bg-light text-dark border">
                                            <strong>{sec.budgetSharePct}%</strong> share
                                        </span>
                                    </div>

                                    {/* Category Progress Bar */}
                                    <div className="progress my-0.5" style={{ height: '6px', borderRadius: '4px' }}>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: `${sec.budgetSharePct}%`, backgroundColor: sec.color }}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between text-muted mt-0.5" style={{ fontSize: '11.5px' }}>
                                        <span>Total: <strong className="text-dark">₹{sec.total.toLocaleString('en-IN')}</strong></span>
                                        <span className="text-success">Paid: ₹{sec.paid.toLocaleString('en-IN')}</span>
                                        <span className={sec.balance > 0 ? 'text-danger fw-semibold' : 'text-secondary'}>
                                            Bal: ₹{sec.balance.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}