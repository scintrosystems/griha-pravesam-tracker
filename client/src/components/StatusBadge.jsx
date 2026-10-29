import React from 'react';

const STATUS_CONFIG = {
    Completed: 'bg-success text-white',
    Confirmed: 'bg-primary text-white',
    'In Progress': 'bg-warning text-dark',
    Scheduled: 'bg-info text-dark',
    Pending: 'bg-danger text-white'
};

const FLOW = ['Scheduled', 'In Progress', 'Confirmed', 'Completed', 'Pending'];

export default function StatusBadge({ status, itemId, isAdmin, onCycleStatus }) {
    const badgeClass = STATUS_CONFIG[status] || 'bg-secondary text-white';

    if (!isAdmin) {
        return <span className={`badge rounded-pill ${badgeClass}`}>{status}</span>;
    }

    const handleNext = () => {
        const idx = FLOW.indexOf(status);
        const nextStatus = FLOW[(idx + 1) % FLOW.length];
        onCycleStatus(itemId, nextStatus);
    };

    return (
        <button
            type="button"
            className={`btn btn-sm badge rounded-pill ${badgeClass} border-0 shadow-sm`}
            onClick={handleNext}
            title="Click to cycle status"
            style={{ cursor: 'pointer' }}
        >
            {status} <i className="bi bi-arrow-repeat ms-1 opacity-75"></i>
        </button>
    );
}