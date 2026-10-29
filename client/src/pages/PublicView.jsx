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
            <div className="row g-2 g-sm-3 mb-3">
                <div className="col-6 col-md-3">
                    <div className="kpi-card-refined">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="kpi-title">Events Ready</span>
                            <div className="kpi-icon-circle kpi-icon-events">
                                <i className="bi bi-calendar-check"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="kpi-value text-kpi-events">{readinessPct}%</h3>
                            <p className="kpi-subtext">{readyEvents} of {totalEvents} Ready</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="kpi-card-refined">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="kpi-title">Logistics</span>
                            <div className="kpi-icon-circle kpi-icon-rooms">
                                <i className="bi bi-building"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="kpi-value text-kpi-rooms">{logisticsCount}</h3>
                            <p className="kpi-subtext">{items.filter(i => i.tabSlug === 'rooms').length} Rooms, {items.filter(i => i.tabSlug === 'vehicles').length} Vehicles</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="kpi-card-refined">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="kpi-title">Purchase List</span>
                            <div className="kpi-icon-circle kpi-icon-purchase">
                                <i className="bi bi-bag-check"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="kpi-value text-kpi-pooja">
                                {items.filter(i => i.tabSlug === 'purchase' || i.tabSlug === 'shopping').length}
                            </h3>
                            <p className="kpi-subtext">{pendingShopping} Pending</p>
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="kpi-card-refined">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="kpi-title">To-Do Tasks</span>
                            <div className="kpi-icon-circle kpi-icon-todo">
                                <i className="bi bi-check2-square"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="kpi-value text-kpi-todo">{totalTasks}</h3>
                            <p className="kpi-subtext text-danger">Action Required</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter / Search / Time Sort Bar with Uniform Heights */}
            <div className="filter-bar-card mb-3">
                <div className="row g-2 align-items-center">
                    <div className="col-12 col-md-4">
                        <div className="dropdown w-100">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center fw-bold filter-control-height"
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

                    <div className="col-12 col-sm-4 col-md-3">
                        <div className="input-group w-100">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 filter-control-height"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-7 col-sm-5 col-md-3">
                        <div className="d-flex align-items-center gap-1 w-100">
                            <input
                                type="date"
                                className="form-control filter-control-height flex-grow-1"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary text-nowrap filter-control-height px-2"
                                    onClick={() => setSelectedDate('')}
                                >
                                    All
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="col-5 col-sm-3 col-md-2 text-end">
                        <button
                            type="button"
                            className={`btn w-100 text-nowrap filter-control-height px-2 ${timeSort !== 'none' ? 'btn-amber fw-bold' : 'btn-outline-secondary'}`}
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