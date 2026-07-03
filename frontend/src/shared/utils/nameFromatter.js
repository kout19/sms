export const  getInitials = (firstName, lastName) => {
    const name=`${firstName} ${lastName}`;
    if (!name) return "";
  
    // List of titles to ignore
    const titles = ["dr.", "mr.", "mrs.", "ms.", "prof.", "doc."];
  
    const cleanWords = name
      .trim()
      .split(/\s+/)
      .filter((word) => !titles.includes(word.toLowerCase())); // Removes titles
  
    // Takes the first letter of the first and last remaining words
    const firstInitial = cleanWords[0]?.[0] || "";
    const lastInitial =
      cleanWords.length > 1 ? cleanWords[cleanWords.length - 1][0] : "";
  
    return (firstInitial + lastInitial).toUpperCase();
};
export const getFullName=(firstName, lastName)=>{
    return `${firstName} ${lastName}`
  }