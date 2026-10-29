// Colors for progress bars
const SECTION_COLORS = [
    '#d97706', // Amber (Agenda)
    '#059669', // Emerald (Food)
    '#2563eb', // Blue (Rooms)
    '#0891b2', // Cyan (Vehicles)
    '#7c3aed', // Purple (Purchase)
    '#e11d48', // Rose (To-Do)
    '#475569', // Slate (Contacts)
    '#ea580c'  // Orange (Custom)
];

// Helper to sanitize numeric inputs
export const getNumericCost = (item) => {
    const cost = item.totalCost !== undefined && item.totalCost !== null && item.totalCost !== ''
        ? Number(item.totalCost)
        : Number(String(item.amount || '0').replace(/[^0-9.]/g, ''));
    return isNaN(cost) ? 0 : cost;
};

export const getNumericPaid = (item) => {
    const paid = item.paidAmount !== undefined && item.paidAmount !== null && item.paidAmount !== ''
        ? Number(item.paidAmount)
        : 0;
    return isNaN(paid) ? 0 : paid;
};

// Calculate expenses for a specific section
export const calculateSectionExpenses = (items, tabSlug) => {
    const sectionItems = items.filter(i => i.tabSlug === tabSlug);

    let total = 0;
    let paid = 0;

    sectionItems.forEach(item => {
        total += getNumericCost(item);
        paid += getNumericPaid(item);
    });

    const balance = Math.max(0, total - paid);
    const paidPct = total > 0 ? Math.round((paid / total) * 100) : 0;
    const balancePct = total > 0 ? (100 - paidPct) : 0;

    return {
        total,
        paid,
        balance,
        paidPct,
        balancePct,
        count: sectionItems.length
    };
};

// Calculate grand total & section-wise percentage share
export const calculateOverallExpenses = (items, tabs) => {
    let grandTotal = 0;
    let grandPaid = 0;

    // 1. Calculate Grand Totals
    items.forEach(item => {
        grandTotal += getNumericCost(item);
        grandPaid += getNumericPaid(item);
    });

    const grandBalance = Math.max(0, grandTotal - grandPaid);
    const overallPaidPct = grandTotal > 0 ? Math.round((grandPaid / grandTotal) * 100) : 0;
    const overallBalancePct = grandTotal > 0 ? (100 - overallPaidPct) : 0;

    // 2. Calculate Section-wise Breakdown (% share of total budget)
    const displayTabs = tabs.filter(t => t.slug !== 'dayview');

    const sectionBreakdown = displayTabs.map((tab, idx) => {
        const stats = calculateSectionExpenses(items, tab.slug);
        const budgetSharePct = grandTotal > 0 ? ((stats.total / grandTotal) * 100).toFixed(1) : 0;

        return {
            slug: tab.slug,
            label: tab.label,
            icon: tab.icon || 'bi-folder',
            color: SECTION_COLORS[idx % SECTION_COLORS.length],
            total: stats.total,
            paid: stats.paid,
            balance: stats.balance,
            paidPct: stats.paidPct,
            budgetSharePct: Number(budgetSharePct),
            count: stats.count
        };
    });

    return {
        grandTotal,
        grandPaid,
        grandBalance,
        overallPaidPct,
        overallBalancePct,
        sectionBreakdown
    };
};