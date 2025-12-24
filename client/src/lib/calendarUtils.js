/**
 * Formats a date to YYYYMMDDTHHmmssZ for calendar compatibility (UTC)
 */
const formatCalendarDate = (date) => {
  return new Date(date).toISOString().replace(/-|:|"\.\d+"/g, '');
};

/**
 * Generates a Google Calendar link
 */
export const generateGoogleCalendarUrl = (appointment) => {
  const startDate = new Date(appointment.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

  const start = formatCalendarDate(startDate);
  const end = formatCalendarDate(endDate);

  const title = encodeURIComponent(appointment.doctorName || "Doctor Appointment");
  const details = encodeURIComponent(appointment.notes || "");
  const location = encodeURIComponent(appointment.location || "");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

/**
 * Generates and downloads an .ics file for Outlook/Apple Calendar
 */
export const downloadICSFile = (appointment) => {
  const startDate = new Date(appointment.date);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const start = formatCalendarDate(startDate);
  const end = formatCalendarDate(endDate);
  const title = appointment.doctorName || "Doctor Appointment";
  const details = appointment.notes || "";
  const location = appointment.location || "";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HealthSync//NONSGML v1.0//EN",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `appointment-${appointment._id || 'event'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
