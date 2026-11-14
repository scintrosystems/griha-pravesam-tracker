// Safely splits menu items and pairs them with their master lookup notes
export const parseDishesWithNotes = (menuText, lookups = []) => {
  if (!menuText) return [];

  // 1. Split by newline or comma
  let rawParts = menuText.includes('\n')
    ? menuText.split('\n')
    : menuText.includes(',')
    ? menuText.split(',')
    : [menuText];

  const menuLookupItems = Array.isArray(lookups)
    ? lookups.filter(l => l && l.type === 'MENU_ITEM')
    : [];

  return rawParts
    .map(p => p.trim())
    .filter(p => p.length > 0 && p !== '-')
    .map(dishString => {
      // If the string already contains notes in parentheses: e.g. "Idly (120 - ₹ 2040)"
      const match = dishString.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return { name: match[1].trim(), note: match[2].trim() };
      }

      // Otherwise look up in Master Dropdowns
      const foundInMaster = menuLookupItems.find(
        m => m.name && m.name.trim().toLowerCase() === dishString.toLowerCase()
      );

      return {
        name: dishString,
        note: foundInMaster?.notes || ''
      };
    });
};