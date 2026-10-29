import React from 'react';
import StatusBadge from './StatusBadge';
import API from '../api/axiosClient';
import SectionExpenseBar from './SectionExpenseBar';

export default function TableView({
    items,
    activeTabSlug,
    tabs = [],
    isAdmin,
    onEdit,
    onDelete,
    onCycleStatus,
    onRefresh
}) {
    const currentTabLabel = tabs.find(t => t.slug === activeTabSlug)?.label || 'Section';
    const isPurchaseSection = activeTabSlug === 'purchase' || activeTabSlug === 'shopping';

    if (items.length === 0) {
        return (
            <div className="space-y-3">
                <SectionExpenseBar
                    items={items}
                    tabSlug={activeTabSlug}
                    tabs={tabs}
                    tabLabel={currentTabLabel}
                />
                <div className="custom-card text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-3 mb-1 d-block text-secondary opacity-50"></i>
                    <span>No entries matching this filter.</span>
                </div>
            </div>
        );
    }

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

    return (
        <div className="custom-card overflow-hidden">
            {/* 1. Section Financial Ribbon at the top */}
            <SectionExpenseBar
                items={items}
                tabSlug={activeTabSlug}
                tabs={tabs}
                tabLabel={currentTabLabel}
            />

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
                        {items.map((item) => {
                            const isDone = item.isPurchased || item.status === 'Completed';
                            const total = Number(item.totalCost || item.amount || 0);
                            const paid = Number(item.paidAmount || 0);
                            const balance = Math.max(0, total - paid);

                            return (
                                <tr
                                    key={item._id}
                                    style={isDone && isPurchaseSection ? { backgroundColor: '#f8fafc', opacity: 0.65 } : {}}
                                >
                                    {/* Purchase Checkbox */}
                                    {isPurchaseSection && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={!!item.isPurchased}
                                                onChange={() => handleTogglePurchase(item)}
                                                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                            />
                                        </td>
                                    )}

                                    {/* ============================================================== */}
                                    {/* COLUMN 1: Title, Category, Description + FINANCIAL PILL BADGES */}
                                    {/* ============================================================== */}
                                    <td>
                                        <span
                                            className={`fw-bold d-block text-truncate ${isDone && isPurchaseSection ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
                                            style={{ maxWidth: '240px' }}
                                        >
                                            {item.title}
                                        </span>

                                        {/* Category pill (Only for purchase list) */}
                                        {isPurchaseSection && item.category && (
                                            <span className="badge bg-amber-subtle text-dark border border-amber-subtle me-1">
                                                {item.category}
                                            </span>
                                        )}

                                        {/* Extra Description */}
                                        {item.description && (
                                            <span className="text-muted fst-italic d-block mt-0.5" style={{ fontSize: '12px' }}>
                                                <i className="bi bi-card-text me-1 text-amber"></i>{item.description}
                                            </span>
                                        )}

                                        {/* ✅ FINANCIAL BADGES: Total, Paid & Balance for this specific item */}
                                        {(total > 0 || paid > 0) && (
                                            <div className="d-flex flex-wrap align-items-center gap-1 mt-1.5" style={{ fontSize: '11px' }}>
                                                <span className="badge bg-light text-dark border">
                                                    Total: ₹{total.toLocaleString('en-IN')}
                                                </span>
                                                <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                    Paid: ₹{paid.toLocaleString('en-IN')}
                                                </span>
                                                {balance > 0 ? (
                                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                                        Bal: ₹{balance.toLocaleString('en-IN')}
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-success text-white">Settled</span>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* COLUMN 2: Details & Schedule */}
                                    <td>
                                        {item.quantity && <div><strong>Qty:</strong> {item.quantity}</div>}
                                        {item.specifics && <div><strong>Specs:</strong> {item.specifics}</div>}
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

                                    {/* COLUMN 3: Location */}
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

                                    {/* COLUMN 4: Contact Name + Phone Number */}
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

                                    {/* COLUMN 5: Status */}
                                    <td>
                                        <StatusBadge status={item.status} itemId={item._id} isAdmin={isAdmin} onCycleStatus={onCycleStatus} />
                                    </td>

                                    {/* COLUMN 6: Admin Actions */}
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
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}