import { APIError } from "./APIError";

export const calculateNextDate = (freq: string, currentDate: Date): Date => {
    const nextDate = new Date(currentDate);

    const dateAdjustments: { [key: string]: () => void } = {
        D: () => nextDate.setDate(nextDate.getDate() + 1), // Next day
        W: () => nextDate.setDate(nextDate.getDate() + 7), // Next week
        M: () => nextDate.setMonth(nextDate.getMonth() + 1), // Next month
        Y: () => nextDate.setFullYear(nextDate.getFullYear() + 1), // Next year
        Q: () => {
            // Move to the next quarter
            const currentMonth = nextDate.getMonth();
            const nextQuarterStartMonth = Math.floor(currentMonth / 3) * 3 + 3; // Add 3 months
            nextDate.setMonth(nextQuarterStartMonth);
            nextDate.setDate(1); // Set to the first day of the next quarter
        },
        E: () => {
            // Move to the next Saturday
            const dayOfWeek = nextDate.getDay();
            const daysToNextSaturday = (6 - dayOfWeek + 7) % 7; // Saturday is 6
            nextDate.setDate(nextDate.getDate() + daysToNextSaturday);
        },
        E1ST: () => {
            // Move to the first Saturday of the next month
            nextDate.setMonth(nextDate.getMonth() + 1); // Move to next month
            nextDate.setDate(1); // Set to the first day of the next month
            const dayOfWeek = nextDate.getDay();
            const daysToFirstSaturday = (6 - dayOfWeek + 7) % 7; // Saturday is 6
            nextDate.setDate(nextDate.getDate() + daysToFirstSaturday); // Set to the first Saturday
        },
        E2ND: () => {
            // Move to the second Saturday of the next month
            nextDate.setMonth(nextDate.getMonth() + 1); // Move to next month
            nextDate.setDate(1); // Set to the first day of the next month
            const dayOfWeek = nextDate.getDay();
            const daysToFirstSaturday = (6 - dayOfWeek + 7) % 7; // Saturday is 6
            nextDate.setDate(nextDate.getDate() + daysToFirstSaturday); // Set to the first Saturday
            nextDate.setDate(nextDate.getDate() + 7); // Add 7 days to move to the second Saturday
        },
        E3RD: () => {
            // Move to the third Saturday of the next month
            nextDate.setMonth(nextDate.getMonth() + 1); // Move to next month
            nextDate.setDate(1); // Set to the first day of the next month
            const dayOfWeek = nextDate.getDay();
            const daysToFirstSaturday = (6 - dayOfWeek + 7) % 7; // Saturday is 6
            nextDate.setDate(nextDate.getDate() + daysToFirstSaturday); // Set to the first Saturday
            nextDate.setDate(nextDate.getDate() + 14); // Add 14 days to move to the third Saturday
        },
        ELAST: () => {
            // Move to the last Saturday of the next month
            nextDate.setMonth(nextDate.getMonth() + 1); // Move to next month
            nextDate.setDate(0); // Set to the last day of the next month
            const dayOfWeek = nextDate.getDay();
            const daysToLastSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek; // Saturday is 6
            nextDate.setDate(nextDate.getDate() - daysToLastSaturday); // Set to the last Saturday of the month
        },
    };

    const adjustmentFunction = dateAdjustments[freq];

    if (!adjustmentFunction) {
        throw new APIError(400, "Invalid frequency provided");
    }

    adjustmentFunction(); // Apply the date adjustment

    return nextDate;
};
