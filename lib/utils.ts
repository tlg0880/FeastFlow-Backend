/**
 * Calculates the date of the most recent Monday.
 * If today is Sunday, it will get the Monday of the week that just passed.
 * @param {Date} d The date to check.
 * @returns {Date} The date of the Monday of that week.
 */
export function getWeekStartDate(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // Sunday - 0, Monday - 1, ...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
}