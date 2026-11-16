import React, { useState, useEffect } from 'react';

// File imports
import API from '../api/axiosClient';
import DayMasterView from '../components/DayMasterView';
import TableView from '../components/TableView';
import { sortItemsByTime } from '../utils/timeSort';
import ExpenseOverview from '../components/ExpenseOverview';

export default function PublicView() {
    // State
    const [tabs, setTabs] = useState([]);
    const [items, setItems] = useState([]);
    const [lookups, setLookups] = useState([]);
    const [activeTab, setActiveTab] = useState('dayview');
    const [selectedDate, setSelectedDate] = useState('');
    const [search, setSearch] = useState('');
    const [timeSort, setTimeSort] = useState('asc');
    const [loading, setLoading] = useState(true);

    // Settings
    const [settings, setSettings] = useState({
        showOverallExpensesToPublic: false,
        showSectionExpensesToPublic: false
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tabsRes, itemsRes, lookupsRes, settingsRes] = await Promise.all([
                API.get('/tabs').catch(() => ({ data: [] })),
                API.get('/items').catch(() => ({ data: [] })),
                API.get('/lookups').catch(() => ({ data: [] })), // 👈 FETCH LOOKUPS
                API.get('/settings').catch(() => ({ data: {} }))
            ]);

            setTabs(Array.isArray(tabsRes.data) ? tabsRes.data : []);
            setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
            setLookups(Array.isArray(lookupsRes.data) ? lookupsRes.data : []); // 👈 SET LOOKUPS
            if (settingsRes.data && typeof settingsRes.data === 'object') {
                setSettings({
                    showOverallExpensesToPublic: !!settingsRes.data.showOverallExpensesToPublic,
                    showSectionExpensesToPublic: !!settingsRes.data.showSectionExpensesToPublic
                });
            }
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

    filteredItems = sortItemsByTime(filteredItems, timeSort);

    const tabSpecificItems = activeTab === 'dayview'
        ? filteredItems
        : filteredItems.filter(i => i && i.tabSlug === activeTab);

    const readyEvents = safeItems.filter(i => i && i.tabSlug === 'schedule' && (i.status === 'Confirmed' || i.status === 'Completed')).length;
    const totalEvents = safeItems.filter(i => i && i.tabSlug === 'schedule').length;
    const readinessPct = totalEvents > 0 ? Math.round((readyEvents / totalEvents) * 100) : 0;
    const logisticsCount = safeItems.filter(i => i && (i.tabSlug === 'rooms' || i.tabSlug === 'vehicles')).length;
    const pendingShopping = safeItems.filter(i => i && (i.tabSlug === 'purchase' || i.tabSlug === 'shopping') && i.status !== 'Completed').length;
    const totalTasks = safeItems.filter(i => i && i.tabSlug === 'todo').length;

    return (
        <main className="container px-2 px-sm-3 py-2 py-sm-3">
            {/* 4 KPI Metrics Cards */}
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

            {/* Navigation Card */}
            <div className="filter-bar-card mb-3">
                {/* HORIZONTAL SCROLLABLE TABS */}
                <div className="public-tabs-container pb-2 border-bottom mb-2">
                    <button
                        type="button"
                        className={`public-tab-btn ${activeTab === 'dayview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dayview')}
                    >
                        <i className="bi bi-calendar-check"></i> Day-by-Day Master
                    </button>

                    {tabs.map(tab => (
                        <button
                            key={tab.slug}
                            type="button"
                            className={`public-tab-btn ${activeTab === tab.slug ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.slug)}
                        >
                            <i className={`bi ${tab.icon || 'bi-folder'}`}></i> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search, Calendar Date Picker & Time Sort */}
                <div className="row g-2 align-items-center">
                    <div className="col-12 col-sm-5">
                        <div className="input-group w-100">
                            <span className="input-group-text bg-light border-end-0 py-1">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 filter-control-height"
                                placeholder="Search anything (names, rooms, driver, pooja)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-7 col-sm-4">
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

                    <div className="col-5 col-sm-3 text-end">
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

            {settings.showOverallExpensesToPublic && (
                <ExpenseOverview items={items} tabs={tabs} />
            )}

            {/* Main Content Area */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-amber" role="status"></div>
                    <p className="mt-2 text-muted small">Loading records...</p>
                </div>
            ) : activeTab === 'dayview' ? (
                <DayMasterView
                    tabs={tabs}
                    lookups={lookups}
                    items={filteredItems}
                    currentDay={selectedDate || ''}
                    isAdmin={false}
                />
            ) : (
                <TableView
                    items={tabSpecificItems}
                    activeTabSlug={activeTab}
                    tabs={tabs}
                    lookups={lookups}
                    allItems={items}
                    isAdmin={false}
                    showSectionExpenses={settings.showSectionExpensesToPublic}
                    onRefresh={fetchData}
                />
            )}
        </main>
    );
}