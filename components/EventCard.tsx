
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { Event } from '../types/Event';
import { useComments } from '../hooks/useComments';
import Icon from './Icon';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ event, onPress, onEdit, onDelete }: EventCardProps) {
  const { getCommentCount } = useComments();
  const commentCount = getCommentCount(event.id);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeDisplay = () => {
    if (event.isAllDay) {
      return 'All Day';
    }
    if (event.endTime) {
      return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
    }
    return formatTime(event.startTime);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.colorBar, { backgroundColor: event.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Icon name="pencil" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Icon name="trash" size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Icon name="time" size={14} color={colors.textSecondary} />
          <Text style={styles.timeText}>{getTimeDisplay()}</Text>
        </View>

        {event.location && (
          <View style={styles.locationContainer}>
            <Icon name="location" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}

        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        <View style={styles.footer}>
          {event.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          )}
          
          {commentCount > 0 && (
            <View style={styles.commentContainer}>
              <Icon name="message-circle" size={14} color={colors.textSecondary} />
              <Text style={styles.commentCount}>{commentCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
});
