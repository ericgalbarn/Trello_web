/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

// The frontend side will generate a special card: Placeholder Card, non-related to backend
// This special card will be hidden in the user interface
// The Id structure of this card setting to Unique is a piece of cake, no need for a complex random:
// 'columnId-placeholder-card' (there is only a maximum of one Placeholder Card for each column)
// Important thing to keep in mind when you create: it has to be complete (_id, boardId, columnId, FE_PlaceholderCard)

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
