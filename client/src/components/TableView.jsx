import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import API from '../api/axiosClient';
import SectionExpenseBar from './SectionExpenseBar';

export default function TableView({
    items = [],
    activeTabSlug,
    tabs = [],
    isAdmin = false,
    showSectionExpenses = false,
    onEdit,
    onDelete,
    onCycleStatus,
    onRefresh
}) {
    const currentTabLabel = tabs.find(t => t.slug === activeTabSlug)?.label || 'Section';
    const isPurchaseSection = activeTabSlug === 'purchase' || activeTabSlug === 'shopping';
    const shouldShowExpenseRibbon = isAdmin || showSectionExpenses;

    // Category Budget editing modal state
    const [editingBudgetCat, setEditingBudgetCat] = useState(null); // 'Poojai' | 'General' | null
    const [budgetCost, setBudgetCost] = useState('');
    const [budgetPaid, setBudgetPaid] = useState('');

    // Find or calculate parent category budget items
    const poojaiBudgetItem = items.find(i => i.tabSlug === 'purchase' && i.isCategoryBudget && i.category === 'Poojai');
    const generalBudgetItem = items.find(i => i.tabSlug === 'purchase' && i.isCategoryBudget && i.category === 'General');

    const poojaiCost = poojaiBudgetItem ? Number(poojaiBudgetItem.totalCost || 0) : 0;
    const poojaiPaid = poojaiBudgetItem ? Number(poojaiBudgetItem.paidAmount || 0) : 0;
    const poojaiBal = Math.max(0, poojaiCost - poojaiPaid);

    const generalCost = generalBudgetItem ? Number(generalBudgetItem.totalCost || 0) : 0;
    const generalPaid = generalBudgetItem ? Number(generalBudgetItem.paidAmount || 0) : 0;
    const generalBal = Math.max(0, generalCost - generalPaid);

    const handleOpenBudgetModal = (category) => {
        setEditingBudgetCat(category);
        if (category === 'Poojai') {
            setBudgetCost(poojaiCost || '');
            setBudgetPaid(poojaiPaid || '');
        } else {
            setBudgetCost(generalCost || '');
            setBudgetPaid(generalPaid || '');
        }
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        const existing = editingBudgetCat === 'Poojai' ? poojaiBudgetItem : generalBudgetItem;
        const numCost = Number(budgetCost) || 0;
        const numPaid = Number(budgetPaid) || 0;

        const payload = {
            tabSlug: 'purchase',
            title: `${editingBudgetCat} Category Budget`,
            category: editingBudgetCat,
            isCategoryBudget: true,
            totalCost: numCost,
            paidAmount: numPaid,
            status: numPaid >= numCost && numCost > 0 ? 'Completed' : 'Confirmed'
        };

        try {
            if (existing?._id) {
                await API.put(`/items/${existing._id}`, payload);
            } else {
                await API.post('/items', payload);
            }
            setEditingBudgetCat(null);
            if (onRefresh) onRefresh();
        } catch (err) {
            alert('Failed to save category budget');
        }
    };

    const handleTogglePurchase = async (item) => {
        try {
            const nextPurchased = !item.isPurchased;
            const nextStatus = nextPurchased ? 'Completed' : 'Pending';
            await API.put(`/items/${item._id}`, { ...item, isPurchased: nextPurchased, status: nextStatus });
            if (onRefresh) onRefresh();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // Filter out budget markers from the checklist view
    const checklistItems = isPurchaseSection
        ? items.filter(i => !i.isCategoryBudget)
        : items;

    const poojaiList = checklistItems.filter(i => (i.category || 'Poojai') === 'Poojai');
    const generalList = checklistItems.filter(i => i.category === 'General');

    const renderItemRow = (item) => {
        const isDone = item.isPurchased || item.status === 'Completed';
        const total = Number(item.totalCost || item.amount || 0);
        const paid = Number(item.paidAmount || 0);
        const balance = Math.max(0, total - paid);

        return (
            <tr
                key={item._id}
                style={isDone && isPurchaseSection ? { backgroundColor: '#f8fafc', opacity: 0.65 } : {}}
            >
                {isPurchaseSection && (
                    <td style={{ width: '45px' }}>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={!!item.isPurchased}
                            onChange={() => handleTogglePurchase(item)}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                    </td>
                )}

                <td>
                    <span
                        className={`fw-bold d-block text-truncate ${isDone && isPurchaseSection ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
                        style={{ maxWidth: '240px' }}
                    >
                        {item.title}
                    </span>

                    {item.description && (
                        <span className="text-muted fst-italic d-block mt-0.5" style={{ fontSize: '12px' }}>
                            <i className="bi bi-card-text me-1 text-amber"></i>{item.description}
                        </span>
                    )}

                    {/* If NOT purchase section, show individual financials */}
                    {!isPurchaseSection && isAdmin && (total > 0 || paid > 0) && (
                        <div className="d-flex flex-wrap align-items-center gap-1 mt-1.5" style={{ fontSize: '11px' }}>
                            <span className="badge bg-light text-dark border">Total: ₹{total.toLocaleString('en-IN')}</span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle">Paid: ₹{paid.toLocaleString('en-IN')}</span>
                            {balance > 0 ? (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Bal: ₹{balance.toLocaleString('en-IN')}</span>
                            ) : (
                                <span className="badge bg-success text-white">Settled</span>
                            )}
                        </div>
                    )}
                </td>

                <td>
                    {item.quantity && <div><strong>Qty:</strong> {item.quantity}</div>}
                    {item.specifics && <div><strong>Specs:</strong> {item.specifics}</div>}
                    {item.purchasedFrom && (
                        <div className="text-secondary small">
                            <strong>Source:</strong> {item.purchasedFrom}
                        </div>
                    )}
                    {item.menuItems && <div><strong>Menu:</strong> {item.menuItems}</div>}
                    {item.roomTariff && <div><strong>Tariff:</strong> {item.roomTariff}</div>}
                    {item.roomCount && <div><strong>Rooms:</strong> {item.roomCount} ({item.headcountPerRoom || '2 Max'})</div>}

                    {item.checkInDate && (
                        <div className="small text-secondary mt-0.5">
                            <span className="text-dark fw-bold">In:</span> {item.checkInDate} {item.checkInTime} | <span className="text-dark fw-bold">Out:</span> {item.checkOutDate} {item.checkOutTime}
                        </div>
                    )}
                    {item.bookedBy && <div><strong>Booked By:</strong> {item.bookedBy}</div>}
                    {item.rentPerDay && <div><strong>Rent:</strong> {item.rentPerDay} • {item.kmRate}</div>}

                    {item.date && (
                        <span className="badge bg-light text-secondary border mt-1">
                            <i className="bi bi-calendar3 me-1 text-amber"></i>{item.date} {item.timeSlot && `• ${item.timeSlot}`}
                        </span>
                    )}
                </td>

                <td>
                    {item.location ? (
                        item.location.mapUrl ? (
                            <a href={item.location.mapUrl} target="_blank" rel="noreferrer" className="text-danger fw-semibold text-decoration-none">
                                <i className="bi bi-geo-alt-fill me-1"></i>{item.location.name}
                            </a>
                        ) : (
                            <span><i className="bi bi-geo-alt me-1 text-secondary"></i>{item.location.name}</span>
                        )
                    ) : item.hotelDetails ? (
                        <span>{item.hotelDetails}</span>
                    ) : (
                        '—'
                    )}
                </td>

                <td>
                    {item.inCharge ? (
                        <div>
                            <div className="fw-semibold text-dark">
                                <i className="bi bi-person-fill text-amber me-1"></i>{item.inCharge.name}
                            </div>
                            {item.inCharge.phone && (
                                <a href={`tel:${item.inCharge.phone}`} className="text-success fw-bold text-decoration-none small d-inline-block mt-0.5">
                                    <i className="bi bi-telephone-fill me-1"></i>{item.inCharge.phone}
                                </a>
                            )}
                        </div>
                    ) : item.phone ? (
                        <div>
                            <div className="fw-semibold text-dark">{item.title}</div>
                            <a href={`tel:${item.phone}`} className="text-success fw-bold text-decoration-none small d-inline-block mt-0.5">
                                <i className="bi bi-telephone-fill me-1"></i>{item.phone}
                            </a>
                            {item.role && <div className="text-muted small">({item.role})</div>}
                        </div>
                    ) : item.driverNumber ? (
                        <a href={`tel:${item.driverNumber}`} className="text-success fw-bold text-decoration-none small">
                            <i className="bi bi-telephone-fill me-1"></i>{item.driverNumber}
                        </a>
                    ) : (
                        '—'
                    )}
                </td>

                <td>
                    <StatusBadge status={item.status} itemId={item._id} isAdmin={isAdmin} onCycleStatus={onCycleStatus} />
                </td>

                {isAdmin && (
                    <td className="text-end text-nowrap">
                        <button type="button" className="btn btn-sm btn-outline-warning py-1 px-2 me-1" onClick={() => onEdit(item)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger py-1 px-2" onClick={() => onDelete(item._id)}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </td>
                )}
            </tr>
        );
    };

    return (
        <div className="space-y-3">
            {/* Financial ribbon */}
            {shouldShowExpenseRibbon && (
                <SectionExpenseBar
                    items={items}
                    tabSlug={activeTabSlug}
                    tabs={tabs}
                    tabLabel={currentTabLabel}
                />
            )}

            {/* ============================================================== */}
            {/* PURCHASE LIST: Category-Wise Budget Cards (Poojai vs General)  */}
            {/* ============================================================== */}
            {isPurchaseSection && (
                <div className="row g-2 mb-3">
                    {/* Poojai Category Budget Card */}
                    <div className="col-12 col-md-6">
                        <div className="custom-card p-3 border-amber-subtle bg-amber-subtle d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                                    <span className="fs-5">🪔</span> Poojai Items Category Budget
                                </span>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-amber py-0.5 px-2"
                                        onClick={() => handleOpenBudgetModal('Poojai')}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i> Set Budget
                                    </button>
                                )}
                            </div>
                            <div className="d-flex justify-content-between align-items-baseline mt-2">
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Total Budget</span>
                                    <h5 className="fw-bold text-dark mb-0">₹{poojaiCost.toLocaleString('en-IN')}</h5>
                                </div>
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Paid / Advance</span>
                                    <h6 className="fw-bold text-success mb-0">₹{poojaiPaid.toLocaleString('en-IN')}</h6>
                                </div>
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Balance Due</span>
                                    <h6 className={`fw-bold mb-0 ${poojaiBal > 0 ? 'text-danger' : 'text-secondary'}`}>
                                        ₹{poojaiBal.toLocaleString('en-IN')}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* General Category Budget Card */}
                    <div className="col-12 col-md-6">
                        <div className="custom-card p-3 border bg-light d-flex flex-column justify-content-between h-100">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                                    <span className="fs-5">🛍️</span> General Provisions Category Budget
                                </span>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary py-0.5 px-2"
                                        onClick={() => handleOpenBudgetModal('General')}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i> Set Budget
                                    </button>
                                )}
                            </div>
                            <div className="d-flex justify-content-between align-items-baseline mt-2">
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Total Budget</span>
                                    <h5 className="fw-bold text-dark mb-0">₹{generalCost.toLocaleString('en-IN')}</h5>
                                </div>
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Paid / Advance</span>
                                    <h6 className="fw-bold text-success mb-0">₹{generalPaid.toLocaleString('en-IN')}</h6>
                                </div>
                                <div>
                                    <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Balance Due</span>
                                    <h6 className={`fw-bold mb-0 ${generalBal > 0 ? 'text-danger' : 'text-secondary'}`}>
                                        ₹{generalBal.toLocaleString('en-IN')}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* TABLE VIEW (Grouped by Category on Purchase List)               */}
            {/* ============================================================== */}
            <div className="custom-card overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: '640px' }}>
                        <thead className="table-light text-secondary">
                            <tr>
                                {isPurchaseSection && <th style={{ width: '45px' }}>Done</th>}
                                <th>Title / Item</th>
                                <th>Details & Specifics</th>
                                <th>Location / Address</th>
                                <th>In-Charge / Contact</th>
                                <th>Status</th>
                                {isAdmin && <th className="text-end">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {/* If Purchase List: Show Poojai Group first, then General Group */}
                            {isPurchaseSection ? (
                                <>
                                    {/* Header: Poojai Items */}
                                    <tr className="table-warning border-top">
                                        <td colSpan={isAdmin ? 7 : 6} className="py-2 px-3 fw-bold text-dark">
                                            🪔 Poojai Items Checklist ({poojaiList.length} items)
                                        </td>
                                    </tr>
                                    {poojaiList.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 6} className="text-center text-muted py-3 small">
                                                No poojai items added yet. Click "+ Add Record" to add one.
                                            </td>
                                        </tr>
                                    ) : (
                                        poojaiList.map(renderItemRow)
                                    )}

                                    {/* Header: General Provisions */}
                                    <tr className="table-secondary border-top">
                                        <td colSpan={isAdmin ? 7 : 6} className="py-2 px-3 fw-bold text-dark">
                                            🛍️ General Provisions & Gifts Checklist ({generalList.length} items)
                                        </td>
                                    </tr>
                                    {generalList.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 6} className="text-center text-muted py-3 small">
                                                No general items added yet. Click "+ Add Record" to add one.
                                            </td>
                                        </tr>
                                    ) : (
                                        generalList.map(renderItemRow)
                                    )}
                                </>
                            ) : checklistItems.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="text-center text-muted py-4 small">
                                        No entries matching this filter.
                                    </td>
                                </tr>
                            ) : (
                                checklistItems.map(renderItemRow)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Budget Modal (Admin Only) */}
            {editingBudgetCat && (
                <div className="modal-backdrop-custom">
                    <div className="modal-modern" style={{ maxWidth: '420px' }}>
                        <div className="modal-header-modern">
                            <h6 className="header-title">Set {editingBudgetCat} Category Budget</h6>
                            <button type="button" className="btn-close" onClick={() => setEditingBudgetCat(null)}></button>
                        </div>
                        <form onSubmit={handleSaveBudget}>
                            <div className="p-3">
                                <div className="mb-2.5">
                                    <label className="modal-label">Total Category Budget (₹) *</label>
                                    <input
                                        type="number"
                                        className="modal-input w-100"
                                        placeholder="e.g. 15000"
                                        value={budgetCost}
                                        onChange={(e) => setBudgetCost(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-2.5">
                                    <label className="modal-label">Paid / Advance Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="modal-input w-100"
                                        placeholder="e.g. 5000"
                                        value={budgetPaid}
                                        onChange={(e) => setBudgetPaid(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="modal-label">Balance Remaining</label>
                                    <div className="balance-display-box">
                                        ₹{Math.max(0, (Number(budgetCost) || 0) - (Number(budgetPaid) || 0)).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer-modern">
                                <button type="button" className="btn-cancel" onClick={() => setEditingBudgetCat(null)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save Category Budget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}