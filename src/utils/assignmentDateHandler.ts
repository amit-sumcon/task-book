export const calculateAssignmentDate = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1); // Move to the next day

    // Check if it's Sunday (0 = Sunday in JavaScript Date)
    if (nextDay.getDay() === 0) {
        nextDay.setDate(nextDay.getDate() + 1); // Move to Monday
    }

    return nextDay;
};
