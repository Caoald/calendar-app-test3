
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

export const getShortDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const generateCalendarDays = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Previous month days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push({
      date: formatDate(new Date(prevYear, prevMonth, day)),
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date: formatDate(date),
      day,
      isCurrentMonth: true,
      isToday: isToday(date),
    });
  }

  // Next month days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length; // 6 weeks * 7 days

  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: formatDate(new Date(nextYear, nextMonth, day)),
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};
