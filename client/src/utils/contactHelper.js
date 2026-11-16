export const formatContactDisplay = (inChargeVal, allItems = [], lookups = []) => {
    if (!inChargeVal) return null;

    // 1. If it's already an object
    if (typeof inChargeVal === 'object') {
        return {
            name: inChargeVal.title || inChargeVal.name || '',
            phone: inChargeVal.phone || ''
        };
    }

    const str = String(inChargeVal).trim();

    // 2. If it's a 24-character MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(str)) {
        // Check in Contact Directory items
        const directory = Array.isArray(allItems) ? allItems.filter(i => i && i.tabSlug === 'contacts') : [];
        let found = directory.find(c => String(c._id) === str);

        // Also check in Master Lookups
        if (!found && Array.isArray(lookups)) {
            found = lookups.find(l => String(l._id) === str);
        }

        if (found) {
            return {
                name: found.title || found.name || 'Contact',
                phone: found.phone || ''
            };
        }

        // If ID belongs to a deleted contact, show dash instead of "Contact Assigned"
        return null;
    }

    // 3. If already formatted as "Name (Phone)"
    const phoneMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
    if (phoneMatch) {
        return {
            name: phoneMatch[1].trim(),
            phone: phoneMatch[2].trim()
        };
    }

    // 4. If plain string text (e.g. "Arunkumar")
    if (str === 'Contact Assigned') return null;

    return {
        name: str,
        phone: ''
    };
};