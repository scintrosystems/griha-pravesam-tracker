import React from 'react';
import './DayMasterView.css';
import StatusBadge from './StatusBadge';

const SECTION_THEMES = {
    schedule: { headerClass: 'sec-header-schedule', defaultIcon: 'bi-calendar-event' },
    food: { headerClass: 'sec-header-food', defaultIcon: 'bi-egg-fried' },
    rooms: { headerClass: 'sec-header-rooms', defaultIcon: 'bi-building' },
    vehicles: { headerClass: 'sec-header-vehicles', defaultIcon: 'bi-car-front' },
    purchase: { headerClass: 'sec-header-purchase', defaultIcon: 'bi-bag-check' },
    shopping: { headerClass: 'sec-header-purchase', defaultIcon: 'bi-bag-check' },
    todo: { headerClass: 'sec-header-todo', defaultIcon: 'bi-check2-square' },
    contacts: { headerClass: 'sec-header-contacts', defaultIcon: 'bi-person-lines-fill' }
};

export default function DayMasterView({ tabs = [], items = [], currentDay, isAdmin, onCycleStatus }) {
    if (!tabs || tabs.length === 0) {
        return (
            <div className="custom-card text-center py-4 text-muted small">
                <i className="bi bi-inbox fs-4 mb-1 d-block opacity-50"></i>
                <span>No sections configured.</span>
            </div>
        );
    }

    const displayTabs = tabs.filter(t => t.slug !== 'dayview');

    return (
        <div className="mb-4">
            {/* 1. Top Master Banner with Generous Padding */}
            <div className="day-master-banner">
                <div className="d-flex align-items-center gap-2.5 min-w-0">
                    <div className="day-master-banner-icon">
                        <i className="bi bi-calendar2-check-fill"></i>
                    </div>
                    <div className="min-w-0">
                        <h5 className="day-master-banner-title text-truncate">
                            Daily Master View {currentDay ? `(${currentDay})` : '(All Days)'}
                        </h5>
                        <span className="day-master-banner-sub text-truncate">
                            Live agenda, food, rooms, vehicles, pooja & to-dos
                        </span>
                    </div>
                </div>

                <span className="day-master-badge">
                    {items.length} Total Records
                </span>
            </div>

            {/* 2. Grid of Sections */}
            <div className="row g-2 g-sm-3">
                {displayTabs.map((tab) => {
                    const theme = SECTION_THEMES[tab.slug] || {
                        headerClass: 'sec-header-custom',
                        defaultIcon: tab.icon || 'bi-folder'
                    };
                    const sectionItems = items.filter((i) => i.tabSlug === tab.slug);

                    return (
                        <div key={tab.slug} className="col-12 col-md-6">
                            <div className="day-master-card h-100">
                                {/* Header with Title & Counter */}
                                <div className={`day-master-card-header ${theme.headerClass}`}>
                                    <span className="fw-bold small d-flex align-items-center gap-2 text-truncate">
                                        <i className={`bi ${tab.icon || theme.defaultIcon}`}></i>
                                        <span className="text-truncate">{tab.label}</span>
                                    </span>
                                    <span className="badge rounded-pill bg-white text-dark border">
                                        {sectionItems.length}
                                    </span>
                                </div>

                                {/* Content List */}
                                <div className="day-master-card-body" style={{ maxHeight: '290px', overflowY: 'auto' }}>
                                    {sectionItems.length === 0 ? (
                                        <div className="day-master-empty-state">
                                            <div className="day-master-empty-icon">
                                                <i className="bi bi-calendar-x"></i>
                                            </div>
                                            <p className="day-master-empty-text">No entries logged for this date</p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {sectionItems.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="day-master-item d-flex justify-content-between align-items-start gap-2"
                                                >
                                                    <div className="min-w-0 flex-grow-1">
                                                        <span className="fw-bold text-dark small d-block text-truncate">
                                                            {item.title}
                                                        </span>

                                                        {/* Date & Time Pills */}
                                                        <div className="d-flex flex-wrap align-items-center gap-1 my-1">
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

                                                        {/* Location & In-Charge with Phone */}
                                                        <div className="small text-secondary" style={{ fontSize: '11px' }}>
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
                                                        </div>

                                                        {/* Rooms Check-in / Out display */}
                                                        {item.checkInDate && (
                                                            <div className="text-secondary small mt-0.5" style={{ fontSize: '11px' }}>
                                                                <strong>In:</strong> {item.checkInDate} {item.checkInTime} | <strong>Out:</strong> {item.checkOutDate} {item.checkOutTime}
                                                                {item.bookedBy && <span> • By: {item.bookedBy}</span>}
                                                            </div>
                                                        )}

                                                        {item.details && (
                                                            <span className="badge bg-light text-dark border mt-1" style={{ fontSize: '10px' }}>
                                                                {item.details}
                                                            </span>
                                                        )}

                                                        {item.description && (
                                                            <div className="small text-muted fst-italic mt-1" style={{ fontSize: '10px' }}>
                                                                <i className="bi bi-card-text me-1 text-amber"></i>{item.description}
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