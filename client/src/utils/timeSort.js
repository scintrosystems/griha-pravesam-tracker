// Parse start time / timeslot string to minutes from midnight
export const parseTimeToMinutes = (timeStr, startTimeStr) => {
    if (startTimeStr && startTimeStr.includes(':')) {
        const [h, m] = startTimeStr.split(':');
        return parseInt(h, 10) * 60 + parseInt(m || '0', 10);
    }

    if (!timeStr) return 9999;
    const s = String(timeStr).trim().toLowerCase();

    if (s.includes('morning') && !s.match(/\d:\d/)) return 480;
    if (s.includes('afternoon') && !s.match(/\d:\d/)) return 780;
    if (s.includes('evening') && !s.match(/\d:\d/)) return 1020;
    if (s.includes('night') && !s.match(/\d:\d/)) return 1260;

    let match = s.match(/(?:^|[^\d])(\d{1,2})[:.](\d{2})\s*(am|pm)?/i);
    if (!match) match = s.match(/(?:^|[^\d])(\d{1,2})\s*(am|pm)/i);
    if (!match) return 9999;

    let hours = parseInt(match[1], 10);
    let minutes = match[2] && !isNaN(parseInt(match[2], 10)) ? parseInt(match[2], 10) : 0;
    let ampm = (match[3] || '').toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

// Sort array chronologically by date and time
export const sortItemsByTime = (items, sortMode) => {
    if (sortMode === 'none') return items;

    return [...items].sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        const dateCompare = dateA.localeCompare(dateB);

        if (dateCompare !== 0) {
            return sortMode === 'desc' ? -dateCompare : dateCompare;
        }

        const minA = parseTimeToMinutes(a.timeSlot, a.startTime);
        const minB = parseTimeToMinutes(b.timeSlot, b.startTime);

        return sortMode === 'desc' ? minB - minA : minA - minB;
    });
};