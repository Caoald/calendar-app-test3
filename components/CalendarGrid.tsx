
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { generateCalendarDays, getShortDayName } from '../utils/dateUtils';
import { Event } from '../types/Event';

interface CalendarGridProps {
  year: number;
  month: number;
  events: Event[];
  selectedDate?: string;
  onDatePress: (date: string) => void;
}

export default function CalendarGrid({ year, month, events, selectedDate, onDatePress }: CalendarGridProps) {
  const calendarDays = generateCalendarDays(year, month);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const renderDayHeader = () => (
    <View style={styles.dayHeaderRow}>
      {dayNames.map((dayName) => (
        <View key={dayName} style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{dayName}</Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarDay = (dayData: any, index: number) => {
    const dayEvents = getEventsForDate(dayData.date);
    const isSelected = selectedDate === dayData.date;

    return (
      <TouchableOpacity
        key={`${dayData.date}-${index}`}
        style={[
          styles.dayCell,
          dayData.isToday && styles.todayCell,
          isSelected && styles.selectedCell,
          !dayData.isCurrentMonth && styles.otherMonthCell,
        ]}
        onPress={() => onDatePress(dayData.date)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            dayData.isToday && styles.todayText,
            isSelected && styles.selectedText,
            !dayData.isCurrentMonth && styles.otherMonthText,
          ]}
        >
          {dayData.day}
        </Text>
        {dayEvents.length > 0 && (
          <View style={styles.eventIndicatorContainer}>
            {dayEvents.slice(0, 3).map((event, eventIndex) => (
              <View
                key={event.id}
                style={[
                  styles.eventIndicator,
                  { backgroundColor: event.color },
                ]}
              />
            ))}
            {dayEvents.length > 3 && (
              <Text style={styles.moreEventsText}>+{dayEvents.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeek = (weekDays: any[], weekIndex: number) => (
    <View key={weekIndex} style={styles.weekRow}>
      {weekDays.map((dayData, dayIndex) => renderCalendarDay(dayData, dayIndex))}
    </View>
  );

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {renderDayHeader()}
      {weeks.map((week, index) => renderWeek(week, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    margin: 1,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  todayCell: {
    backgroundColor: colors.primary,
  },
  selectedCell: {
    backgroundColor: colors.accent,
  },
  otherMonthCell: {
    backgroundColor: colors.backgroundAlt,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  todayText: {
    color: colors.background,
    fontWeight: '700',
  },
  selectedText: {
    color: colors.background,
    fontWeight: '700',
  },
  otherMonthText: {
    color: colors.textSecondary,
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  moreEventsText: {
    fontSize: 8,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
