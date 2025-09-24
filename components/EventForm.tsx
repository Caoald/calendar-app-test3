
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Event, EventFormData } from '../types/Event';
import { formatDate, formatTime } from '../utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import Button from './Button';
import Icon from './Icon';

interface EventFormProps {
  event?: Event;
  initialDate?: string;
  onSave: (eventData: EventFormData) => void;
  onCancel: () => void;
}

const eventColors = [
  '#4A90E2', '#50C878', '#F39C12', '#E74C3C', '#9B59B6',
  '#1ABC9C', '#34495E', '#E67E22', '#95A5A6', '#2ECC71'
];

const categories = [
  'Work', 'Personal', 'Health', 'Education', 'Travel',
  'Social', 'Family', 'Fitness', 'Meeting', 'Other'
];

const reminderOptions = [
  { label: 'None', value: 0 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1 day', value: 1440 },
];

export default function EventForm({ event, initialDate, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: initialDate || formatDate(new Date()),
    startTime: formatTime(new Date()),
    endTime: formatTime(new Date(Date.now() + 60 * 60 * 1000)), // 1 hour later
    color: eventColors[0],
    category: categories[0],
    isAllDay: false,
    location: '',
    reminder: 15,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime || '',
        color: event.color,
        category: event.category || categories[0],
        isAllDay: event.isAllDay || false,
        location: event.location || '',
        reminder: event.reminder || 15,
      });
    }
  }, [event]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the event');
      return;
    }

    console.log('Saving event:', formData);
    onSave(formData);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: formatDate(selectedDate) }));
    }
  };

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, startTime: formatTime(selectedTime) }));
    }
  };

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, endTime: formatTime(selectedTime) }));
    }
  };

  const renderColorPicker = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Color</Text>
      <View style={styles.colorGrid}>
        {eventColors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              formData.color === color && styles.selectedColor,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, color }))}
          />
        ))}
      </View>
    </View>
  );

  const renderCategoryPicker = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryOption,
              formData.category === category && styles.selectedCategory,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, category }))}
          >
            <Text
              style={[
                styles.categoryText,
                formData.category === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {event ? 'Edit Event' : 'New Event'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Event title"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Event description"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateTimeText}>{formData.date}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>All Day</Text>
            <TouchableOpacity
              style={[styles.toggle, formData.isAllDay && styles.toggleActive]}
              onPress={() => setFormData(prev => ({ ...prev, isAllDay: !prev.isAllDay }))}
            >
              <View style={[styles.toggleThumb, formData.isAllDay && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {!formData.isAllDay && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartTimePicker(true)}>
                <Icon name="time" size={20} color={colors.primary} />
                <Text style={styles.dateTimeText}>{formData.startTime}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndTimePicker(true)}>
                <Icon name="time" size={20} color={colors.primary} />
                <Text style={styles.dateTimeText}>{formData.endTime}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Event location"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {renderColorPicker()}
        {renderCategoryPicker()}

        <View style={styles.section}>
          <Text style={styles.label}>Reminder</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reminderScroll}>
            {reminderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.reminderOption,
                  formData.reminder === option.value && styles.selectedReminder,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, reminder: option.value }))}
              >
                <Text
                  style={[
                    styles.reminderText,
                    formData.reminder === option.value && styles.selectedReminderText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.date)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${formData.startTime}:00`)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartTimeChange}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${formData.endTime}:00`)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndTimeChange}
        />
      )}
    </ScrollView>
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
  },
  cancelButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.background,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.text,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: colors.background,
  },
  reminderScroll: {
    flexDirection: 'row',
  },
  reminderOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedReminder: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reminderText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  selectedReminderText: {
    color: colors.background,
  },
});
