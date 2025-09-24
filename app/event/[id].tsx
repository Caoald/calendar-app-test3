
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useEvents } from '../../hooks/useEvents';
import { useComments } from '../../hooks/useComments';
import { Event } from '../../types/Event';
import { CommentFormData } from '../../types/Comment';
import Icon from '../../components/Icon';
import CommentCard from '../../components/CommentCard';
import CommentInput from '../../components/CommentInput';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { events } = useEvents();
  const { getCommentsForEvent, addComment, deleteComment } = useComments();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find(e => e.id === id);
      setEvent(foundEvent || null);
      console.log('Event found:', foundEvent?.title);
    }
  }, [id, events]);

  const handleAddComment = async (commentData: CommentFormData) => {
    if (!event) return;
    
    try {
      await addComment(event.id, commentData);
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId);
              console.log('Comment deleted successfully');
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          },
        },
      ]
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeDisplay = () => {
    if (!event) return '';
    if (event.isAllDay) {
      return 'All Day';
    }
    if (event.endTime) {
      return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
    }
    return formatTime(event.startTime);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const comments = getCommentsForEvent(event.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventCard}>
          <View style={[styles.colorBar, { backgroundColor: event.color }]} />
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            
            <View style={styles.eventDetail}>
              <Icon name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.eventDetailText}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.eventDetail}>
              <Icon name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.eventDetailText}>{getTimeDisplay()}</Text>
            </View>

            {event.location && (
              <View style={styles.eventDetail}>
                <Icon name="location" size={16} color={colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            )}

            {event.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            )}

            {event.category && (
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.commentsSection}>
          <View style={styles.commentsSectionHeader}>
            <Text style={styles.commentsSectionTitle}>
              Comments ({comments.length})
            </Text>
          </View>

          {comments.length === 0 ? (
            <View style={styles.emptyCommentsContainer}>
              <Icon name="message-circle" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyCommentsText}>No comments yet</Text>
              <Text style={styles.emptyCommentsSubtext}>
                Be the first to add a comment to this event
              </Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <CommentInput onAddComment={handleAddComment} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  eventContent: {
    flex: 1,
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDetailText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 24,
    paddingBottom: 20,
  },
  commentsSectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  commentsSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyCommentsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  commentsList: {
    paddingBottom: 20,
  },
});
