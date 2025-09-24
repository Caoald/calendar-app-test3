
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import { useNotifications } from '../hooks/useNotifications';
import { Event, EventFormData } from '../types/Event';
import { formatDate, getMonthName, addMonths } from '../utils/dateUtils';
import CalendarGrid from '../components/CalendarGrid';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';

export default function CalendarScreen() {
  const { requestPermissions } = useNotifications();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  } = useEvents();

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleDatePress = (date: string) => {
    console.log('Date pressed:', date);
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
    setSelectedDate(null);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        console.log('Event updated successfully');
      } else {
        await addEvent(eventData);
        console.log('Event added successfully');
      }
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleGroupsPress = () => {
    router.push('/groups');
  };

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <Icon name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Icon name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleGroupsPress} style={styles.groupsButton}>
            <Icon name="users" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
            <Icon name="plus" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      <CalendarGrid
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        events={events}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
      />

      {selectedDate && (
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {formatSelectedDate()}
          </Text>
          <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
            {selectedDateEvents.length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Icon name="calendar" size={48} color={colors.textSecondary} />
                <Text style={styles.noEventsText}>No events for this day</Text>
                <TouchableOpacity onPress={handleAddEvent} style={styles.addEventButton}>
                  <Text style={styles.addEventButtonText}>Add Event</Text>
                </TouchableOpacity>
              </View>
            ) : (
              selectedDateEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onEdit={() => handleEditEvent(event)}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      )}

      <SimpleBottomSheet isVisible={showEventForm} onClose={handleCancelEventForm}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
  },
  groupsButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateSection: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventsContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addEventButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEventButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
