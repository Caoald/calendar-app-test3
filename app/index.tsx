
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import { useEvents } from '../hooks/useEvents';
import { useNotifications } from '../hooks/useNotifications';
import EventForm from '../components/EventForm';
import { Event, EventFormData } from '../types/Event';
import SimpleBottomSheet from '../components/BottomSheet';
import CalendarGrid from '../components/CalendarGrid';
import { formatDate, getMonthName, addMonths } from '../utils/dateUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    ...commonStyles.header,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  calendarContainer: {
    backgroundColor: colors.background,
  },
  selectedDateContainer: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  eventsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  eventCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { scheduleEventReminder, cancelEventReminder } = useNotifications();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const selectedDateEvents = events.filter(event => event.date === selectedDate);

  const handleDatePress = (date: string) => {
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    cancelEventReminder(eventId);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    try {
      let savedEvent: Event;
      
      if (editingEvent) {
        savedEvent = await updateEvent(editingEvent.id, eventData);
        // Cancel old reminder and schedule new one
        await cancelEventReminder(editingEvent.id);
      } else {
        savedEvent = await addEvent(eventData);
      }
      
      // Schedule notification reminder
      await scheduleEventReminder(savedEvent);
      
      setShowEventForm(false);
      setEditingEvent(undefined);
    } catch (error) {
      console.log('Error saving event:', error);
    }
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (formatDate(date) === formatDate(today)) {
      return 'Today';
    } else if (formatDate(date) === formatDate(tomorrow)) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleGroupsPress = () => {
    router.push('/groups');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="calendar" size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleGroupsPress}>
            <Icon name="people" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Icon name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.monthNavigation}>
        <TouchableOpacity style={styles.monthButton} onPress={handlePreviousMonth}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {getMonthName(month)} {year}
        </Text>
        <TouchableOpacity style={styles.monthButton} onPress={handleNextMonth}>
          <Icon name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <CalendarGrid
          year={year}
          month={month}
          events={events}
          selectedDate={selectedDate}
          onDatePress={handleDatePress}
        />
      </View>

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>{formatSelectedDate()}</Text>
      </View>

      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>Events</Text>
          <Text style={styles.eventCount}>
            {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {selectedDateEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.noEventsText}>
              No events scheduled for this day.{'\n'}Tap the + button to add an event.
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {selectedDateEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEditEvent(event)}
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <SimpleBottomSheet
        isVisible={showEventForm}
        onClose={handleCancelEventForm}
      >
        <EventForm
          event={editingEvent}
          initialDate={selectedDate}
          onSave={handleSaveEvent}
          onCancel={handleCancelEventForm}
        />
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
