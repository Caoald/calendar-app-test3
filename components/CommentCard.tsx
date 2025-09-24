
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Comment } from '../types/Comment';
import { colors } from '../styles/commonStyles';
import { formatTime } from '../utils/dateUtils';
import Icon from './Icon';

interface CommentCardProps {
  comment: Comment;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CommentCard({ comment, onEdit, onDelete }: CommentCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.authorContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {comment.author.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{comment.author}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(comment.timestamp)}</Text>
          </View>
        </View>
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
      <Text style={styles.commentText}>{comment.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 1px 3px ${colors.shadow}`,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
