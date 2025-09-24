
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime?: string; // HH:MM format
  color: string;
  category?: string;
  isAllDay?: boolean;
  reminder?: number; // minutes before event
  location?: string;
  createdAt: string;
  updatedAt: string;
  comments?: string[]; // Array of comment IDs
}

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export type ViewMode = 'month' | 'week' | 'day';

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  category: string;
  isAllDay: boolean;
  location: string;
  reminder: number;
}
