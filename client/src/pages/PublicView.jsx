import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import DayMasterView from '../components/DayMasterView';
import TableView from '../components/TableView';
import { sortItemsByTime } from '../utils/timeSort';
import ExpenseOverview from '../components/ExpenseOverview';

export default function PublicView() {
    const [tabs, setTabs] = useState([]);
    const [items, setItems] = useState([]);
    const [lookups, setLookups] = useState([]); // Added state
    const [activeTab, setActiveTab] = useState('dayview');
    const [selectedDate, setSelectedDate] = useState('');
    const [search, setSearch] = useState('');
    const [timeSort, setTimeSort] = useState('none');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tabsRes, itemsRes, lookupsRes] = await Promise.all([
                API.get('/tabs').catch(() => ({ data: [] })),
                API.get('/items').catch(() => ({ data: [] })),
                API.get('/lookups').catch(() => ({ data: [] }))
            ]);

            // Always guarantee arrays
            setTabs(Array.isArray(tabsRes.data) ? tabsRes.data : []);
            setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
            setLookups(Array.isArray(lookupsRes.data) ? lookupsRes.data : []);
        } catch (err) {
            console.error('Failed to load data', err);
            setItems([]);
            setTabs([]);
            setLookups([]);
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

    // Safe array fallback
    const safeItems = Array.isArray(items) ? items : [];

    let filteredItems = safeItems;
    if (selectedDate) {
        filteredItems = filteredItems.filter(i => i && i.date === selectedDate);
    }
    if (search.trim()) {
        const q = search.toLowerCase();
        filteredItems = filteredItems.filter(i =>
            i && (
                i.title?.toLowerCase().includes(q) ||
                i.description?.toLowerCase().includes(q) ||
                i.details?.toLowerCase().includes(q) ||
                i.location?.name?.toLowerCase().includes(q) ||
                i.inCharge?.name?.toLowerCase().includes(q)
            )
        );
    }

    // Apply Chronological Time Sorting
    filteredItems = sortItemsByTime(filteredItems, timeSort);

    const tabSpecificItems = activeTab === 'dayview'
        ? filteredItems
        : filteredItems.filter(i => i && i.tabSlug === activeTab);

    // Exact KPI Calculations using safeItems
    const readyEvents = safeItems.filter(i => i && i.tabSlug === 'schedule' && (i.status === 'Confirmed' || i.status === 'Completed')).length;
    const totalEvents = safeItems.filter(i => i && i.tabSlug === 'schedule').length;
    const readinessPct = totalEvents > 0 ? Math.round((readyEvents / totalEvents) * 100) : 0;
    const logisticsCount = safeItems.filter(i => i && (i.tabSlug === 'rooms' || i.tabSlug === 'vehicles')).length;
    const pendingShopping = safeItems.filter(i => i && (i.tabSlug === 'purchase' || i.tabSlug === 'shopping') && i.status !== 'Completed').length;
    const totalTasks = safeItems.filter(i => i && i.tabSlug === 'todo').length;

    const currentTabLabel = activeTab === 'dayview'
        ? 'Day-by-Day Master'
        : (tabs.find(t => t.slug === activeTab)?.label || 'Selected Section');

    return (
        <main className="container px-2 px-sm-3 py-2 py-sm-3">
            {/* KPI Cards */}
            <div className="row g-1.5 g-sm-2 mb-2 mb-sm-3">
                <div className="col-6 col-md-3">
                    <div className="custom-card p-2 p-sm-3 h-100">
                        <div className="d-flex justify-content-between align-items-center text-muted text-uppercase" style={{ fontSize: '10px' }}>
                            <span className="fw-bold">Ready</span>
                            <i className="bi bi-calendar-check text-kpi-events"></i>
                        </div>
                        <h3 className="h5 fw-bold text-kpi-events mb-0 mt-1">{readinessPct}%</h3>
                        <span className="text-muted d-block text-truncate" style={{ fontSize: '10px' }}>{readyEvents} of {totalEvents}</span>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="custom-card p-2 p-sm-3 h-100">
                        <div className="d-flex justify-content-between align-items-center text-muted text-uppercase" style={{ fontSize: '10px' }}>
                            <span className="fw-bold">Logistics</span>
                            <i className="bi bi-building text-kpi-rooms"></i>
                        </div>
                        <h3 className="h5 fw-bold text-kpi-rooms mb-0 mt-1">{logisticsCount}</h3>
                        <span className="text-muted d-block text-truncate" style={{ fontSize: '10px' }}>Active Bookings</span>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="custom-card p-2 p-sm-3 h-100">
                        <div className="d-flex justify-content-between align-items-center text-muted text-uppercase" style={{ fontSize: '10px' }}>
                            <span className="fw-bold">Purchase List</span>
                            <i className="bi bi-bag-check text-kpi-pooja"></i>
                        </div>
                        <h3 className="h5 fw-bold text-kpi-pooja mb-0 mt-1">
                            {items.filter(i => i.tabSlug === 'purchase' || i.tabSlug === 'shopping').length}
                        </h3>
                        <span className="text-muted d-block text-truncate" style={{ fontSize: '10px' }}>{pendingShopping} Pending</span>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="custom-card p-2 p-sm-3 h-100">
                        <div className="d-flex justify-content-between align-items-center text-muted text-uppercase" style={{ fontSize: '10px' }}>
                            <span className="fw-bold">Tasks</span>
                            <i className="bi bi-check2-square text-kpi-todo"></i>
                        </div>
                        <h3 className="h5 fw-bold text-kpi-todo mb-0 mt-1">{totalTasks}</h3>
                        <span className="text-danger d-block text-truncate" style={{ fontSize: '10px' }}>Action Required</span>
                    </div>
                </div>
            </div>

            {/* Filter / Search / Time Sort Bar */}
            <div className="custom-card p-2 p-sm-2.5 mb-2 mb-sm-3">
                <div className="row g-2 align-items-center">
                    {/* Section Dropdown */}
                    <div className="col-12 col-md-4">
                        <div className="dropdown w-100">
                            <button
                                className="btn btn-sm btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center fw-bold py-1.5"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <span className="text-truncate me-1">
                                    <i className="bi bi-grid-fill me-1.5 text-amber"></i>{currentTabLabel}
                                </span>
                            </button>
                            <ul className="dropdown-menu w-100 shadow-sm" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                <li>
                                    <button
                                        className={`dropdown-item small fw-bold ${activeTab === 'dayview' ? 'active bg-amber text-white' : ''}`}
                                        onClick={() => setActiveTab('dayview')}
                                    >
                                        <i className="bi bi-calendar-check me-2"></i> Day-by-Day Master
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider my-1" /></li>
                                {tabs.map(tab => (
                                    <li key={tab.slug}>
                                        <button
                                            className={`dropdown-item small ${activeTab === tab.slug ? 'active bg-amber text-white fw-bold' : ''}`}
                                            onClick={() => setActiveTab(tab.slug)}
                                        >
                                            <i className={`bi ${tab.icon} me-2`}></i> {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="col-12 col-sm-4 col-md-3">
                        <div className="input-group input-group-sm w-100">
                            <span className="input-group-text bg-light border-end-0 py-1">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 py-1"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Calendar Picker */}
                    <div className="col-7 col-sm-5 col-md-3">
                        <div className="d-flex align-items-center gap-1 w-100">
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
                    </div>

                    {/* Time Sorting Toggle Button */}
                    <div className="col-5 col-sm-3 col-md-2 text-end">
                        <button
                            type="button"
                            className={`btn btn-sm w-100 text-nowrap py-1 px-2 ${timeSort !== 'none' ? 'btn-amber fw-bold' : 'btn-outline-secondary'}`}
                            onClick={toggleTimeSort}
                            title="Toggle Chronological Time Sorting"
                        >
                            <i className="bi bi-arrow-down-up me-1"></i>
                            {timeSort === 'asc' ? 'Earliest ⬆' : timeSort === 'desc' ? 'Latest ⬇' : 'Time: Def'}
                        </button>
                    </div>
                </div>
            </div>

            <ExpenseOverview items={items} tabs={tabs} />

            {/* Main Content Area */}
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
                    isAdmin={false}
                />
            ) : (
                <TableView
                    items={tabSpecificItems}
                    activeTabSlug={activeTab}
                    tabs={tabs}
                    isAdmin={false}
                    onRefresh={fetchData}
                />
            )}
        </main>
    );
}