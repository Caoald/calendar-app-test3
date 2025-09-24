
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { ChatMessage as ChatMessageType } from '../types/Chat';
import { formatTime } from '../utils/dateUtils';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  onDelete?: () => void;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundAlt,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.textSecondary,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: colors.background,
  },
  otherUserText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  currentUserTimestamp: {
    color: colors.background,
  },
  otherUserTimestamp: {
    color: colors.textSecondary,
  },
  imageMessage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 4,
  },
  emojiMessage: {
    fontSize: 24,
    lineHeight: 28,
  },
});

export default function ChatMessage({ message, isCurrentUser, onDelete }: ChatMessageProps) {
  const containerStyle = [
    styles.messageContainer,
    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
  ];

  const textStyle = [
    styles.messageText,
    isCurrentUser ? styles.currentUserText : styles.otherUserText,
  ];

  const timestampStyle = [
    styles.timestamp,
    isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
  ];

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <View>
            {message.imageUri && (
              <Image source={{ uri: message.imageUri }} style={styles.imageMessage} />
            )}
            {message.content && (
              <Text style={textStyle}>{message.content}</Text>
            )}
          </View>
        );
      case 'emoji':
        return (
          <Text style={[textStyle, styles.emojiMessage]}>{message.content}</Text>
        );
      default:
        return (
          <Text style={textStyle}>{message.content}</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={containerStyle}
        onLongPress={isCurrentUser ? onDelete : undefined}
      >
        {!isCurrentUser && (
          <Text style={styles.username}>{message.username}</Text>
        )}
        {renderContent()}
        <Text style={timestampStyle}>
          {formatTime(message.timestamp)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
