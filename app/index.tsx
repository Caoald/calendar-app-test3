
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import { formatDate, getMonthName, addMonths } from '../utils/dateUtils';
import CalendarGrid from '../components/CalendarGrid';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';
import { Event, EventFormData } from '../types/Event';

export default function CalendarScreen() {
  const { events, loading, addEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const selectedEvents = getEventsForDate(selectedDate);

  const handleDatePress = (date: string) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
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
    console.log('Deleting event:', eventId);
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
      setEditingEvent(undefined);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${dayName}, ${monthName} ${day}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.text}>Loading calendar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.monthText}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Icon name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Grid */}
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          events={events}
          selectedDate={selectedDate}
          onDatePress={handleDatePress}
        />

        {/* Selected Date Events */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.eventsSectionTitle}>
              {formatSelectedDate()}
            </Text>
            <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
              <Icon name="add" size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          {selectedEvents.length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noEventsText}>No events for this day</Text>
              <TouchableOpacity onPress={handleAddEvent} style={styles.addEventButton}>
                <Text style={styles.addEventButtonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => console.log('Event pressed:', event.title)}
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Icon name="add" size={28} color={colors.background} />
      </TouchableOpacity>

      {/* Event Form Bottom Sheet */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  eventsSection: {
    flex: 1,
    paddingTop: 16,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  eventsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 8,
  },
});
