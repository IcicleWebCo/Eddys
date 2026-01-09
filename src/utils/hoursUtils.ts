export interface BusinessHours {
  day: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const DEFAULT_HOURS: BusinessHours[] = DAYS_OF_WEEK.map(day => ({
  day,
  open_time: '09:00',
  close_time: '17:00',
  is_closed: false
}));

export function formatTimeDisplay(time: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${displayHour}:${minutes} ${ampm}`;
}

export function groupConsecutiveDays(hours: BusinessHours[]): Array<{
  days: string;
  hours: string;
  is_closed: boolean;
}> {
  if (!hours || hours.length === 0) return [];

  const groups: Array<{
    days: string;
    hours: string;
    is_closed: boolean;
  }> = [];

  let currentGroup: BusinessHours[] = [hours[0]];

  for (let i = 1; i < hours.length; i++) {
    const current = hours[i];
    const previous = hours[i - 1];

    if (
      current.is_closed === previous.is_closed &&
      current.open_time === previous.open_time &&
      current.close_time === previous.close_time
    ) {
      currentGroup.push(current);
    } else {
      groups.push(formatGroup(currentGroup));
      currentGroup = [current];
    }
  }

  groups.push(formatGroup(currentGroup));
  return groups;
}

function formatGroup(group: BusinessHours[]): {
  days: string;
  hours: string;
  is_closed: boolean;
} {
  const firstDay = group[0];
  const lastDay = group[group.length - 1];

  let days: string;
  if (group.length === 1) {
    days = firstDay.day;
  } else if (group.length === 2) {
    days = `${firstDay.day} & ${lastDay.day}`;
  } else {
    days = `${firstDay.day} - ${lastDay.day}`;
  }

  const hours = firstDay.is_closed
    ? 'Closed'
    : `${formatTimeDisplay(firstDay.open_time)} - ${formatTimeDisplay(firstDay.close_time)}`;

  return {
    days,
    hours,
    is_closed: firstDay.is_closed
  };
}

export function validateHours(hours: BusinessHours[]): string | null {
  for (const day of hours) {
    if (!day.is_closed) {
      if (!day.open_time || !day.close_time) {
        return `Please set both open and close times for ${day.day}`;
      }

      if (day.open_time >= day.close_time) {
        return `Closing time must be after opening time for ${day.day}`;
      }
    }
  }
  return null;
}

export function convertToStructuredData(
  hours: BusinessHours[]
): Array<{ '@type': string; dayOfWeek: string; opens?: string; closes?: string }> {
  const dayMap: { [key: string]: string } = {
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Sunday': 'Sunday'
  };

  return hours
    .filter(h => !h.is_closed)
    .map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.day],
      opens: h.open_time,
      closes: h.close_time
    }));
}
