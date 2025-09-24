
import { useState, useEffect } from 'react';
import { Event } from '../types/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleEvents } from '../data/sampleEvents';

const EVENTS_STORAGE_KEY = 'calendar_events';
const FIRST_LAUNCH_KEY = 'calendar_first_launch';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from storage
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      
      if (!isFirstLaunch) {
        // First launch - load sample data
        console.log('First launch detected, loading sample events');
        setEvents(sampleEvents);
        await saveEvents(sampleEvents);
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
      } else {
        // Load existing events
        const storedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
          console.log('Loaded events:', parsedEvents.length);
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Fallback to sample events if there's an error
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = async (newEvents: Event[]) => {
    try {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
      console.log('Events saved successfully');
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
    console.log('Event added:', newEvent.title);
    return newEvent;
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
    console.log('Event updated:', eventId);
  };

  const deleteEvent = async (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
    console.log('Event deleted:', eventId);
  };

  const getEventsForDate = (date: string): Event[] => {
    return events.filter(event => event.date === date);
  };

  const getEventsForMonth = (year: number, month: number): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const getTodayEvents = (): Event[] => {
    const today = new Date().toISOString().split('T')[0];
    return getEventsForDate(today);
  };

  const getUpcomingEvents = (days: number = 7): Event[] => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= futureDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForMonth,
    getTodayEvents,
    getUpcomingEvents,
    refreshEvents: loadEvents,
  };
};
