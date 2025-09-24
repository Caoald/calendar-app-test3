
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  eventReminders: boolean;
  groupMessages: boolean;
  reminderTime: number; // minutes before event
}
