export const calculateAverageRating = (average_ratings) => {
    if (!average_ratings || average_ratings.length === 0) return 0;

    const sum = average_ratings.reduce((acc, curr) => {
        return acc + (curr.value || 0);
    }, 0);

    return sum / average_ratings.length;
};