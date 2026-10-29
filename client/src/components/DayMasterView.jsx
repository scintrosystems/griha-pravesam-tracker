import React from 'react';
import StatusBadge from './StatusBadge';

// Thematic color mapping for sections
const SECTION_THEMES = {
    schedule: { headerClass: 'sec-header-schedule', iconColor: 'text-warning', defaultIcon: 'bi-calendar-event' },
    food: { headerClass: 'sec-header-food', iconColor: 'text-success', defaultIcon: 'bi-egg-fried' },
    rooms: { headerClass: 'sec-header-rooms', iconColor: 'text-primary', defaultIcon: 'bi-building' },
    vehicles: { headerClass: 'sec-header-vehicles', iconColor: 'text-info', defaultIcon: 'bi-car-front' },
    shopping: { headerClass: 'sec-header-shopping', iconColor: 'text-indigo', defaultIcon: 'bi-basket' },
    todo: { headerClass: 'sec-header-todo', iconColor: 'text-danger', defaultIcon: 'bi-check2-square' },
    contacts: { headerClass: 'sec-header-contacts', iconColor: 'text-secondary', defaultIcon: 'bi-person-lines-fill' }
};

export default function DayMasterView({ tabs, items, currentDay, isAdmin, onCycleStatus }) {
    if (!tabs || tabs.length === 0) {
        return (
            <div className="custom-card text-center py-4 text-muted small">
                <i className="bi bi-inbox fs-4 mb-1 d-block"></i>
                <span>No sections configured.</span>
            </div>
        );
    }

    const displayTabs = tabs.filter(t => t.slug !== 'dayview');

    return (
        <div className="space-y-3">
            {/* Top Banner */}
            <div className="custom-card p-2.5 mb-2.5 bg-amber-subtle border-amber-subtle d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2 min-w-0">
                    <i className="bi bi-calendar2-check-fill text-amber fs-5 shrink-0"></i>
                    <div className="min-w-0">
                        <h6 className="mb-0 fw-bold text-dark text-truncate">
                            Daily Master View {currentDay ? `(${currentDay})` : '(All Days)'}
                        </h6>
                        <span className="text-secondary small d-block text-truncate">Live agenda, food, rooms, vehicles, pooja & to-dos</span>
                    </div>
                </div>
                <span className="badge bg-white text-dark border px-2.5 py-1.5 shadow-xs">
                    {items.length} Total Records
                </span>
            </div>

            {/* Dynamic Themed Grid */}
            <div className="row g-2 g-sm-3">
                {displayTabs.map((tab) => {
                    const theme = SECTION_THEMES[tab.slug] || {
                        headerClass: 'sec-header-custom',
                        iconColor: 'text-amber',
                        defaultIcon: tab.icon || 'bi-folder'
                    };
                    const sectionItems = items.filter((i) => i.tabSlug === tab.slug);

                    return (
                        <div key={tab.slug} className="col-12 col-md-6">
                            <div className="custom-card h-100 overflow-hidden shadow-xs d-flex flex-column border">

                                {/* Themed Header with Icon & Counter */}
                                <div className={`card-header border-bottom d-flex align-items-center justify-content-between py-2 px-3 ${theme.headerClass}`}>
                                    <span className="fw-bold small d-flex align-items-center gap-2 text-truncate">
                                        <i className={`bi ${tab.icon || theme.defaultIcon} fs-6`}></i>
                                        <span className="text-truncate">{tab.label}</span>
                                    </span>
                                    <span className="badge rounded-pill bg-white text-dark border shadow-xs">
                                        {sectionItems.length}
                                    </span>
                                </div>

                                {/* Content List */}
                                <div className="p-2 p-sm-2.5 flex-grow-1" style={{ maxHeight: '290px', overflowY: 'auto' }}>
                                    {sectionItems.length === 0 ? (
                                        <div className="text-center text-muted py-3 small">
                                            <i className="bi bi-calendar-x d-block fs-5 opacity-40 mb-1"></i>
                                            <span>No entries logged for this date.</span>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {sectionItems.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="p-2 rounded border bg-white d-flex justify-content-between align-items-start gap-2 shadow-xs hover-shadow"
                                                >
                                                    <div className="min-w-0 flex-grow-1">
                                                        <span className="fw-bold text-dark small d-block text-truncate">
                                                            {item.title}
                                                        </span>

                                                        {/* Date & Time Pills */}
                                                        <div className="d-flex flex-wrap align-items-center gap-1 my-0.5">
                                                            {item.date && (
                                                                <span className="badge bg-light text-secondary border" style={{ fontSize: '10px' }}>
                                                                    <i className="bi bi-calendar3 me-1 text-amber"></i>{item.date}
                                                                </span>
                                                            )}
                                                            {item.timeSlot && (
                                                                <span className="badge bg-amber-subtle text-dark border border-amber-subtle" style={{ fontSize: '10px' }}>
                                                                    <i className="bi bi-clock me-1 text-amber"></i>{item.timeSlot}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Location & Transport & In-Charge */}
                                                        <div className="small text-secondary mt-0.5" style={{ fontSize: '11px' }}>
                                                            {item.location && (
                                                                <span className="me-2 d-inline-block text-truncate" style={{ maxWidth: '170px' }}>
                                                                    {item.location.mapUrl ? (
                                                                        <a
                                                                            href={item.location.mapUrl}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-danger fw-semibold text-decoration-none"
                                                                        >
                                                                            <i className="bi bi-geo-alt-fill me-1"></i>{item.location.name}
                                                                        </a>
                                                                    ) : (
                                                                        <span><i className="bi bi-geo-alt me-1"></i>{item.location.name}</span>
                                                                    )}
                                                                </span>
                                                            )}

                                                            {item.transportMode && (
                                                                <span className="me-2 d-inline-block text-secondary">
                                                                    <i className="bi bi-car-front me-1"></i>{item.transportMode.name}
                                                                </span>
                                                            )}

                                                            {item.inCharge && (
                                                                <div className="mt-0.5">
                                                                    <span className="fw-semibold text-dark me-1">
                                                                        <i className="bi bi-person me-1 text-amber"></i>{item.inCharge.name}
                                                                    </span>
                                                                    {item.inCharge.phone && (
                                                                        <a href={`tel:${item.inCharge.phone}`} className="text-success fw-bold text-decoration-none">
                                                                            <i className="bi bi-telephone-fill me-1"></i>{item.inCharge.phone}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {item.checkInDate && (
                                                                <div className="text-secondary small mt-0.5" style={{ fontSize: '11px' }}>
                                                                    <strong>In:</strong> {item.checkInDate} {item.checkInTime} | <strong>Out:</strong> {item.checkOutDate} {item.checkOutTime}
                                                                    {item.bookedBy && <span> • By: {item.bookedBy}</span>}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {item.details && (
                                                            <span className="badge bg-light text-dark border mt-1" style={{ fontSize: '10px' }}>
                                                                {item.details}
                                                            </span>
                                                        )}

                                                        {item.notes && (
                                                            <div className="small text-muted fst-italic mt-1" style={{ fontSize: '10px' }}>
                                                                <i className="bi bi-sticky me-1 text-amber"></i>{item.notes}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="shrink-0 pt-0.5">
                                                        <StatusBadge
                                                            status={item.status}
                                                            itemId={item._id}
                                                            isAdmin={isAdmin}
                                                            onCycleStatus={onCycleStatus}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}