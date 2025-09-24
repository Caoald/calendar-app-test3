
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types/Event';
import { NotificationSettings } from '../types/User';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [settings, setSettings] = useState<NotificationSettings>({
    eventReminders: true,
    groupMessages: true,
    reminderTime: 15, // 15 minutes before event
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving notification settings:', error);
    }
  };

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  };

  const scheduleEventReminder = async (event: Event) => {
    if (!settings.eventReminders) return;

    try {
      const eventDateTime = new Date(`${event.date}T${event.startTime}`);
      const reminderTime = new Date(eventDateTime.getTime() - settings.reminderTime * 60000);

      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Event Reminder',
            body: `${event.title} starts in ${settings.reminderTime} minutes`,
            data: { eventId: event.id, type: 'event_reminder' },
          },
          trigger: {
            date: reminderTime,
          },
        });
        console.log('Event reminder scheduled for:', reminderTime);
      }
    } catch (error) {
      console.log('Error scheduling event reminder:', error);
    }
  };

  const cancelEventReminder = async (eventId: string) => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const eventNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.eventId === eventId
      );

      for (const notification of eventNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
      console.log('Event reminders cancelled for event:', eventId);
    } catch (error) {
      console.log('Error cancelling event reminder:', error);
    }
  };

  const sendGroupMessageNotification = async (groupName: string, message: string) => {
    if (!settings.groupMessages) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New message in ${groupName}`,
          body: message,
          data: { type: 'group_message' },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.log('Error sending group message notification:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveNotificationSettings(updatedSettings);
  };

  return {
    expoPushToken,
    settings,
    updateSettings,
    scheduleEventReminder,
    cancelEventReminder,
    sendGroupMessageNotification,
  };
}
