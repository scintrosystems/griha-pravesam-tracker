import React, { useState } from 'react';
import { calculateOverallExpenses } from '../utils/expenseCalculations';

export default function ExpenseOverview({ items, tabs }) {
    const [collapsed, setCollapsed] = useState(true);
    const data = calculateOverallExpenses(items, tabs);

    return (
        <div className="custom-card p-3 mb-3 shadow-xs">
            {/* Header with Collapse Toggle */}
            <div className="d-flex align-items-center justify-content-between mb-2.5 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                    <div className="rounded p-1 bg-amber-subtle text-amber d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                        <i className="bi bi-cash-stack fs-6"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-0">Event Expenses & Budget Allocation</h6>
                        <small className="text-muted">Live calculations across all sections & budget share</small>
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0.5 px-2"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className={`bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'} me-1`}></i>
                    {collapsed ? 'Show' : 'Hide'}
                </button>
            </div>

            {!collapsed && (
                <>
                    {/* 1. Grand Stat Cards: Amounts & Percentages */}
                    <div className="row g-2 mb-3">
                        <div className="col-12 col-md-4">
                            <div className="p-2.5 rounded border bg-light">
                                <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '10.5px' }}>
                                    Grand Total Budget
                                </span>
                                <h4 className="fw-bold text-dark mb-0 mt-0.5">
                                    ₹{data.grandTotal.toLocaleString('en-IN')}
                                </h4>
                                <span className="text-muted small" style={{ fontSize: '11px' }}>100% committed expenses</span>
                            </div>
                        </div>

                        <div className="col-6 col-md-4">
                            <div className="p-2.5 rounded border bg-success-subtle border-success-subtle">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-success-emphasis small fw-bold text-uppercase" style={{ fontSize: '10.5px' }}>
                                        Paid / Settled
                                    </span>
                                    <span className="badge bg-success text-white small">{data.overallPaidPct}%</span>
                                </div>
                                <h4 className="fw-bold text-success mb-0 mt-0.5">
                                    ₹{data.grandPaid.toLocaleString('en-IN')}
                                </h4>
                                <span className="text-muted small" style={{ fontSize: '11px' }}>Cash & advances given</span>
                            </div>
                        </div>

                        <div className="col-6 col-md-4">
                            <div className="p-2.5 rounded border bg-danger-subtle border-danger-subtle">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-danger-emphasis small fw-bold text-uppercase" style={{ fontSize: '10.5px' }}>
                                        Balance To Settle
                                    </span>
                                    <span className="badge bg-danger text-white small">{data.overallBalancePct}%</span>
                                </div>
                                <h4 className="fw-bold text-danger mb-0 mt-0.5">
                                    ₹{data.grandBalance.toLocaleString('en-IN')}
                                </h4>
                                <span className="text-muted small" style={{ fontSize: '11px' }}>Remaining due</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Visual Settlement Progress Bar */}
                    <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '11px' }}>
                            <span>Settlement Progress: <strong>{data.overallPaidPct}% Settled</strong></span>
                            <span><strong>{data.overallBalancePct}% Remaining</strong></span>
                        </div>
                        <div className="progress" style={{ height: '9px', borderRadius: '6px' }}>
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

                    {/* 3. Section-Wise Breakdown (Amount & Percentage Share) */}
                    <span className="modal-label mb-1.5"><i className="bi bi-pie-chart"></i> Section-Wise Budget Allocation (% Share):</span>
                    <div className="row g-2">
                        {data.sectionBreakdown.map((sec) => (
                            <div key={sec.slug} className="col-12 col-md-6">
                                <div className="p-2 rounded border bg-white d-flex flex-column gap-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                                            <i className={`bi ${sec.icon}`} style={{ color: sec.color }}></i>
                                            <span>{sec.label}</span>
                                        </span>
                                        <span className="badge bg-light text-dark border">
                                            <strong>{sec.budgetSharePct}%</strong> of total
                                        </span>
                                    </div>

                                    {/* Section Budget Progress Bar */}
                                    <div className="progress my-0.5" style={{ height: '6px', borderRadius: '4px' }}>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: `${sec.budgetSharePct}%`, backgroundColor: sec.color }}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px' }}>
                                        <span>Total: <strong>₹{sec.total.toLocaleString('en-IN')}</strong></span>
                                        <span className="text-success">Paid: ₹{sec.paid.toLocaleString('en-IN')}</span>
                                        <span className={sec.balance > 0 ? 'text-danger' : 'text-secondary'}>
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