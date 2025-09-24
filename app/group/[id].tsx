
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useGroups } from '../../hooks/useGroups';
import { useEvents } from '../../hooks/useEvents';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { Group } from '../../types/Group';

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
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  groupInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorIndicator: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginRight: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  groupDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  privateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  actionButtonTextPrimary: {
    color: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroupById } = useGroups();
  const { events } = useEvents();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (id) {
      const foundGroup = getGroupById(id);
      setGroup(foundGroup || null);
    }
  }, [id, getGroupById]);

  const handleChatPress = () => {
    if (group) {
      router.push(`/chat/${group.id}`);
    }
  };

  const handleEventsPress = () => {
    // Navigate back to calendar with group filter
    router.push('/');
  };

  const handleMembersPress = () => {
    Alert.alert('Members', 'Member management coming soon!');
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Group settings coming soon!');
  };

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={styles.errorTitle}>Group Not Found</Text>
          <Text style={styles.errorDescription}>
            The group you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </Text>
          <Button
            text="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const groupEvents = events.filter(event => 
    // In a real app, events would have a groupId field
    // For now, we'll show all events
    true
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {group.name}
        </Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Icon name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <View style={[styles.colorIndicator, { backgroundColor: group.color }]} />
            <Text style={styles.groupTitle}>{group.name}</Text>
          </View>
          
          {group.description && (
            <Text style={styles.groupDescription}>{group.description}</Text>
          )}
          
          <View style={styles.memberCount}>
            <Icon name="people" size={16} color={colors.textSecondary} />
            <Text style={styles.memberText}>
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {group.isPrivate && (
            <View style={styles.privateIndicator}>
              <Icon name="lock-closed" size={14} color={colors.textSecondary} />
              <Text style={styles.privateText}>Private Group</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={handleChatPress}
          >
            <Icon name="chatbubbles" size={20} color={colors.background} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
              Open Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEventsPress}>
            <Icon name="calendar" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>
              View Events ({groupEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleMembersPress}>
            <Icon name="people" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>
              Manage Members
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
