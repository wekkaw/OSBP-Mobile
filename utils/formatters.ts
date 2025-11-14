export const formatPotentialValue = (value?: string): string => {
    if (!value) return 'N/A';
  
    const strValue = String(value).trim();
    const parts = strValue.split(/\s+/);
    const num = parseFloat(parts[0]);
  
    if (isNaN(num)) return strValue;
  
    const suffix = parts.length > 1 ? parts[1].toUpperCase() : '';
  
    switch (suffix) {
      case 'M':
        return `$${num.toLocaleString()} Million`;
      case 'K':
        return `$${(num * 1000).toLocaleString()}`;
      case 'B':
        return `$${num.toLocaleString()} Billion`;
      default:
        return `$${num.toLocaleString()}`;
    }
};

export const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
        // Handles ISO strings like "2024-08-15T00:00:00.000Z"
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Fallback for non-standard formats if necessary, otherwise return original
            return dateString;
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString; // Return original string if parsing fails
    }
};