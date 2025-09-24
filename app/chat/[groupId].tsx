
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useGroups } from '../../hooks/useGroups';
import { useChat } from '../../hooks/useChat';
import { useNotifications } from '../../hooks/useNotifications';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import Icon from '../../components/Icon';
import { Group } from '../../types/Group';
import { ChatMessage as ChatMessageType, ChatFormData } from '../../types/Chat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    ...commonStyles.header,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default function ChatScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { getGroupById } = useGroups();
  const { messages, loading, sendMessage, deleteMessage } = useChat(groupId || '');
  const { sendGroupMessageNotification } = useNotifications();
  const [group, setGroup] = useState<Group | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (groupId) {
      const foundGroup = getGroupById(groupId);
      setGroup(foundGroup || null);
    }
  }, [groupId, getGroupById]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async (messageData: ChatFormData) => {
    try {
      await sendMessage(messageData);
      
      // Send notification to other group members (in a real app)
      if (group && messageData.type === 'text') {
        await sendGroupMessageNotification(group.name, messageData.content);
      }
    } catch (error) {
      console.log('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(messageId),
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage
      message={item}
      isCurrentUser={item.userId === 'user1'}
      onDelete={() => handleDeleteMessage(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="chatbubbles" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyDescription}>
        Start the conversation! Send your first message to the group.
      </Text>
    </View>
  );

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Group Not Found</Text>
          <Text style={styles.emptyDescription}>
            The group chat you&apos;re looking for doesn&apos;t exist.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{group.name}</Text>
            <Text style={styles.headerSubtitle}>
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/group/${group.id}`)}>
          <Icon name="information-circle" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <ChatInput onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
}
