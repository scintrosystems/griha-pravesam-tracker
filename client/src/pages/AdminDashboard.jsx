import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosClient';
import TableView from '../components/TableView';
import DayMasterView from '../components/DayMasterView';
import RecordModal from '../components/RecordModal';
import NewTabModal from '../components/NewTabModal';
import LookupModal from '../components/LookupModal';
import { sortItemsByTime } from '../utils/timeSort';
import ExpenseOverview from '../components/ExpenseOverview';

export default function AdminDashboard({ sidebarOpen, onCloseSidebar }) {
    const [tabs, setTabs] = useState([]);
    const [items, setItems] = useState([]);
    const [lookups, setLookups] = useState([]);
    const [activeTab, setActiveTab] = useState('dayview');
    const [selectedDate, setSelectedDate] = useState('');
    const [search, setSearch] = useState('');
    const [timeSort, setTimeSort] = useState('none');
    const [loading, setLoading] = useState(true);

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

    const toggleTimeSort = () => {
        if (timeSort === 'none') setTimeSort('asc');
        else if (timeSort === 'asc') setTimeSort('desc');
        else setTimeSort('none');
    };

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
        if (!window.confirm('Delete tab and all its records?')) return;
        try {
            await API.delete(`/tabs/${slug}`);
            setTabs(tabs.filter(t => t.slug !== slug));
            setItems(items.filter(it => it.tabSlug !== slug));
            setActiveTab('dayview');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete tab');
        }
    };

    let filteredItems = items;
    if (selectedDate) {
        filteredItems = filteredItems.filter(i => i.date === selectedDate);
    }
    if (search.trim()) {
        const q = search.toLowerCase();
        filteredItems = filteredItems.filter(i =>
            i.title?.toLowerCase().includes(q) ||
            i.notes?.toLowerCase().includes(q) ||
            i.location?.name?.toLowerCase().includes(q) ||
            i.inCharge?.name?.toLowerCase().includes(q)
        );
    }

    filteredItems = sortItemsByTime(filteredItems, timeSort);

    const tabSpecificItems = activeTab === 'dayview'
        ? filteredItems
        : filteredItems.filter(i => i.tabSlug === activeTab);

    const selectTab = (slug) => {
        setActiveTab(slug);
        if (onCloseSidebar) onCloseSidebar();
    };

    return (
        <div className="d-flex position-relative">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
                    style={{ zIndex: 1040 }}
                    onClick={onCloseSidebar}
                />
            )}

            {/* Sidebar with "View Public Site" Button */}
            <aside
                className={`admin-sidebar p-3 shadow-sm ${sidebarOpen ? 'd-flex position-fixed top-0 start-0 h-100' : 'd-none d-lg-flex'}`}
                style={{ zIndex: 1045 }}
            >
                <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-shield-check text-amber fs-5"></i>
                        <span className="fw-bold small text-dark">Admin</span>
                    </div>
                    <button type="button" className="btn-close d-lg-none" onClick={onCloseSidebar}></button>
                </div>

                {/* View Public Site Button (Sidebar Top) */}
                <Link
                    to="/"
                    className="btn btn-sm btn-outline-secondary w-100 mb-2.5 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                >
                    <i className="bi bi-eye text-amber"></i>
                    <span>View Public Site</span>
                </Link>

                {/* Vertical Nav List */}
                <ul className="nav nav-pills flex-column gap-1 mb-auto flex-nowrap w-100">
                    <li className="nav-item w-100">
                        <button
                            className={`nav-link w-100 text-start py-1.5 small fw-bold ${activeTab === 'dayview' ? 'btn-amber' : 'text-secondary'}`}
                            onClick={() => selectTab('dayview')}
                        >
                            <i className="bi bi-calendar-check me-2"></i> Day Master View
                        </button>
                    </li>

                    <li className="text-muted fw-bold text-uppercase mt-2 mb-1 px-2" style={{ fontSize: '10px' }}>
                        Sections
                    </li>

                    {tabs.map((tab) => (
                        <li key={tab.slug} className="nav-item w-100 d-flex align-items-center justify-content-between">
                            <button
                                className={`nav-link text-start py-1.5 small fw-semibold text-truncate ${activeTab === tab.slug ? 'btn-amber' : 'text-secondary'}`}
                                style={{ flex: 1 }}
                                onClick={() => selectTab(tab.slug)}
                            >
                                <i className={`bi ${tab.icon} me-2`}></i> {tab.label}
                            </button>
                            {tab.isCustom && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link text-danger p-0 px-1"
                                    onClick={() => handleDeleteTab(tab.slug)}
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            )}
                        </li>
                    ))}

                    <li className="nav-item mt-2 w-100">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-amber w-100 text-start py-1.5 fw-bold"
                            onClick={() => {
                                setShowNewTabModal(true);
                                if (onCloseSidebar) onCloseSidebar();
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Add Custom Tab
                        </button>
                    </li>
                </ul>

                {/* Master Lookups Button */}
                <div className="pt-2 border-top mt-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary w-100 fw-semibold text-truncate"
                        onClick={() => {
                            setShowLookupModal(true);
                            if (onCloseSidebar) onCloseSidebar();
                        }}
                    >
                        <i className="bi bi-gear-fill me-1"></i> Master Dropdowns
                    </button>
                </div>
            </aside>

            {/* Main Admin Content Body */}
            <main className="flex-grow-1 p-2 p-sm-3" style={{ minWidth: 0 }}>
                {/* Title & Navigation Toolbar */}
                <div className="d-flex justify-content-between align-items-center gap-1.5 mb-2 flex-wrap">
                    <h2 className="h6 fw-bold mb-0 text-truncate text-dark">
                        {activeTab === 'dayview' ? 'Day-by-Day Master' : tabs.find(t => t.slug === activeTab)?.label}
                    </h2>

                    <div className="d-flex align-items-center gap-1.5">
                        {/* Quick Public View Link on Toolbar */}
                        <Link to="/" className="btn btn-sm btn-outline-secondary fw-semibold py-1 px-2">
                            <i className="bi bi-eye me-1 text-amber"></i>
                            <span className="d-none d-sm-inline">Public View</span>
                        </Link>

                        <button
                            type="button"
                            className="btn btn-sm btn-amber fw-bold text-nowrap shadow-sm py-1 px-2.5"
                            onClick={() => {
                                setItemToEdit(null);
                                setShowRecordModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Add Record
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="custom-card p-2 mb-2">
                    <div className="row g-1.5 align-items-center">
                        <div className="col-12 col-md-5">
                            <input
                                type="text"
                                className="form-control form-control-sm py-1"
                                placeholder="Search in this view..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-7 col-md-4 d-flex align-items-center gap-1">
                            <input
                                type="date"
                                className="form-control form-control-sm py-1 flex-grow-1"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary text-nowrap py-1 px-2"
                                    onClick={() => setSelectedDate('')}
                                >
                                    All
                                </button>
                            )}
                        </div>

                        <div className="col-5 col-md-3 text-end">
                            <button
                                type="button"
                                className={`btn btn-sm w-100 text-nowrap py-1 px-2 ${timeSort !== 'none' ? 'btn-amber fw-bold' : 'btn-outline-secondary'}`}
                                onClick={toggleTimeSort}
                                title="Toggle Time Sorting"
                            >
                                <i className="bi bi-arrow-down-up me-1"></i>
                                {timeSort === 'asc' ? 'Earliest ⬆' : timeSort === 'desc' ? 'Latest ⬇' : 'Time: Def'}
                            </button>
                        </div>
                    </div>
                </div>

                <ExpenseOverview items={items} tabs={tabs} />

                {/* Dynamic Display */}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-amber" role="status"></div>
                        <p className="mt-2 text-muted small">Loading records...</p>
                    </div>
                ) : activeTab === 'dayview' ? (
                    <DayMasterView
                        tabs={tabs}
                        items={filteredItems}
                        currentDay={selectedDate || ''}
                        isAdmin={true}
                        onCycleStatus={handleCycleStatus}
                    />
                ) : (
                    <TableView
                        items={tabSpecificItems}
                        activeTabSlug={activeTab}
                        tabs={tabs}
                        isAdmin={true}
                        onEdit={(item) => {
                            setItemToEdit(item);
                            setShowRecordModal(true);
                        }}
                        onDelete={handleDeleteItem}
                        onCycleStatus={handleCycleStatus}
                        onRefresh={fetchData}
                    />
                )}
            </main>

            {/* Modals */}
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
        </div>
    );
}