/**
 * Converts a time string in "HH:mm" format to minutes since the start of the day.
 * @param {string} timeStr - Time string (e.g., "09:00", "23:30")
 * @returns {number} Minutes since 00:00
 */
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Calculates the total hours for a shift, accounting for overnight shifts and breaks.
 * @param {string} startTime - "HH:mm"
 * @param {string} endTime - "HH:mm"
 * @param {number} breakDuration - Break in minutes
 * @returns {number} Total hours rounded to 2 decimal places
 */
export const calculateShiftHours = (startTime, endTime, breakDuration = 0) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  let durationMinutes = endMinutes - startMinutes;
  
  // Handle overnight shifts (e.g., 22:00 to 06:00)
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  
  const netMinutes = durationMinutes - Number(breakDuration);
  return Number((netMinutes / 60).toFixed(2));
};
