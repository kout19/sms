export const dateFromatter = (dateString) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',  // "Monday"
      year: 'numeric',  // "2026"
      month: 'long',     // "May"
      day: 'numeric'    // "18"
    });
  };
