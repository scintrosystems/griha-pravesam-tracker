import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import DayMasterView from './DayMasterView';
import TableView from './TableView';
import RecordModal from './RecordModal';
import NewTabModal from './NewTabModal';
import LookupModal from './LookupModal';

export default function Dashboard({ isAdmin }) {
    const [tabs, setTabs] = useState([]);
    const [items, setItems] = useState([]);
    const [lookups, setLookups] = useState([]);
    const [activeTab, setActiveTab] = useState('dayview');
    const [dayFilter, setDayFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [showNewTabModal, setShowNewTabModal] = useState(false);
    const [showLookupModal, setShowLookupModal] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tabsRes, itemsRes, lookupsRes] = await Promise.all([
                API.get('/tabs'),
                API.get('/items'),
                API.get('/lookups')
            ]);
            setTabs(tabsRes.data);
            setItems(itemsRes.data);
            setLookups(lookupsRes.data);
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCycleStatus = async (id, nextStatus) => {
        try {
            await API.patch(`/items/${id}/status`, { status: nextStatus });
            setItems(items.map(it => it._id === id ? { ...it, status: nextStatus } : it));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await API.delete(`/items/${id}`);
            setItems(items.filter(it => it._id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleDeleteTab = async (slug) => {
        if (!window.confirm('Delete this tab and all items inside it?')) return;
        try {
            await API.delete(`/tabs/${slug}`);
            setTabs(tabs.filter(t => t.slug !== slug));
            setItems(items.filter(it => it.tabSlug !== slug));
            setActiveTab('schedule');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete tab');
        }
    };

    // Filter items
    let filteredItems = items;
    if (dayFilter !== 'all') {
        filteredItems = filteredItems.filter(i => i.day === dayFilter || i.day === 'General');
    }
    if (search.trim()) {
        const q = search.toLowerCase();
        filteredItems = filteredItems.filter(i =>
            i.title?.toLowerCase().includes(q) ||
            i.notes?.toLowerCase().includes(q) ||
            i.details?.toLowerCase().includes(q) ||
            i.location?.name?.toLowerCase().includes(q) ||
            i.inCharge?.name?.toLowerCase().includes(q)
        );
    }

    // Active tab items
    const tabSpecificItems = activeTab === 'dayview'
        ? filteredItems
        : filteredItems.filter(i => i.tabSlug === activeTab);

    // KPI Calculations
    const readyEvents = items.filter(i => i.tabSlug === 'schedule' && (i.status === 'Confirmed' || i.status === 'Completed')).length;
    const totalEvents = items.filter(i => i.tabSlug === 'schedule').length;
    const readinessPct = totalEvents > 0 ? Math.round((readyEvents / totalEvents) * 100) : 0;
    const logisticsCount = items.filter(i => i.tabSlug === 'rooms' || i.tabSlug === 'vehicles').length;
    const pendingTasks = items.filter(i => (i.tabSlug === 'todo' || i.tabSlug === 'shopping') && i.status !== 'Completed').length;

    return (
        <div className="container py-3">
            {/* KPI Section */}
            <div className="row g-2 mb-3">
                <div className="col-6 col-md-3">
                    <div className="card shadow-sm border-0 p-2 text-center">
                        <span className="small text-muted fw-bold">EVENTS READY</span>
                        <h4 className="fw-bold text-warning mb-0">{readinessPct}%</h4>
                        <span className="text-secondary small">{readyEvents} of {totalEvents} ready</span>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card shadow-sm border-0 p-2 text-center">
                        <span className="small text-muted fw-bold">ROOMS & VEHICLES</span>
                        <h4 className="fw-bold text-primary mb-0">{logisticsCount}</h4>
                        <span className="text-secondary small">Active bookings</span>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card shadow-sm border-0 p-2 text-center">
                        <span className="small text-muted fw-bold">ACTION REQUIRED</span>
                        <h4 className="fw-bold text-danger mb-0">{pendingTasks}</h4>
                        <span className="text-secondary small">Pending items</span>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card shadow-sm border-0 p-2 text-center">
                        <span className="small text-muted fw-bold">MASTER CONTACTS</span>
                        <h4 className="fw-bold text-success mb-0">{lookups.filter(l => l.type === 'PERSON').length}</h4>
                        <span className="text-secondary small">Registered contacts</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Controls Bar */}
            <div className="card shadow-sm border-0 p-2 mb-3">
                <div className="d-flex align-items-center justify-content-between overflow-x-auto pb-2 border-bottom">
                    <ul className="nav nav-pills flex-nowrap gap-1">
                        <li className="nav-item">
                            <button
                                className={`nav-link py-1 px-3 small fw-bold ${activeTab === 'dayview' ? 'btn-warning active bg-warning text-dark' : 'text-secondary'}`}
                                onClick={() => setActiveTab('dayview')}
                            >
                                <i className="bi bi-calendar-check me-1"></i> Day-by-Day Master
                            </button>
                        </li>
                        {tabs.map((tab) => (
                            <li key={tab.slug} className="nav-item d-flex align-items-center">
                                <button
                                    className={`nav-link py-1 px-2.5 small fw-semibold text-nowrap ${activeTab === tab.slug ? 'bg-warning text-dark active' : 'text-secondary'}`}
                                    onClick={() => setActiveTab(tab.slug)}
                                >
                                    <i className={`bi ${tab.icon} me-1`}></i> {tab.label}
                                </button>
                                {isAdmin && tab.isCustom && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0 ms-1 me-2"
                                        title="Delete Tab"
                                        onClick={() => handleDeleteTab(tab.slug)}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Admin Tools: + Add & + New Tab */}
                    {isAdmin && (
                        <div className="d-flex gap-1 ms-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-warning text-nowrap fw-bold"
                                onClick={() => setShowNewTabModal(true)}
                            >
                                <i className="bi bi-plus-lg"></i> New Tab
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-warning text-nowrap fw-bold shadow-sm"
                                onClick={() => {
                                    setItemToEdit(null);
                                    setShowRecordModal(true);
                                }}
                            >
                                + Add Record
                            </button>
                        </div>
                    )}
                </div>

                {/* Search & Day Filters */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2">
                    <div className="btn-group" role="group">
                        {['all', 'Nov 19', 'Nov 20', 'Nov 21'].map(day => (
                            <button
                                key={day}
                                type="button"
                                className={`btn btn-sm ${dayFilter === day ? 'btn-warning fw-bold' : 'btn-outline-secondary'}`}
                                onClick={() => setDayFilter(day)}
                            >
                                {day === 'all' ? 'All Days' : day}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {isAdmin && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setShowLookupModal(true)}
                                title="Manage Dropdowns"
                            >
                                <i className="bi bi-gear me-1"></i> Dropdowns
                            </button>
                        )}
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search anything..."
                            style={{ minWidth: '180px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="mt-2 text-muted small">Loading tracker records...</p>
                </div>
            ) : activeTab === 'dayview' ? (
                <DayMasterView
                    items={filteredItems}
                    currentDay={dayFilter}
                    isAdmin={isAdmin}
                    onCycleStatus={handleCycleStatus}
                />
            ) : (
                <TableView
                    items={tabSpecificItems}
                    isAdmin={isAdmin}
                    onEdit={(item) => {
                        setItemToEdit(item);
                        setShowRecordModal(true);
                    }}
                    onDelete={handleDeleteItem}
                    onCycleStatus={handleCycleStatus}
                />
            )}

            {/* Modals (Admin Only) */}
            {isAdmin && (
                <>
                    <RecordModal
                        show={showRecordModal}
                        onClose={() => setShowRecordModal(false)}
                        itemToEdit={itemToEdit}
                        activeTabSlug={activeTab}
                        tabs={tabs}
                        lookups={lookups}
                        onItemSaved={fetchData}
                        onOpenLookupModal={() => setShowLookupModal(true)}
                    />
                    <NewTabModal
                        show={showNewTabModal}
                        onClose={() => setShowNewTabModal(false)}
                        onTabCreated={(newTab) => {
                            setTabs([...tabs, newTab]);
                            setActiveTab(newTab.slug);
                        }}
                    />
                    <LookupModal
                        show={showLookupModal}
                        onClose={() => setShowLookupModal(false)}
                        lookups={lookups}
                        onLookupUpdated={fetchData}
                    />
                </>
            )}
        </div>
    );
}