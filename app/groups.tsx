
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useGroups } from '../hooks/useGroups';
import GroupCard from '../components/GroupCard';
import GroupForm from '../components/GroupForm';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { Group, GroupFormData } from '../types/Group';

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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
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
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    paddingHorizontal: 32,
  },
});

export default function GroupsScreen() {
  const { groups, loading, addGroup, updateGroup, deleteGroup } = useGroups();
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();

  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setShowGroupForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeleteGroup = (group: Group) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGroup(group.id),
        },
      ]
    );
  };

  const handleSaveGroup = async (groupData: GroupFormData) => {
    try {
      if (editingGroup) {
        await updateGroup(editingGroup.id, groupData);
      } else {
        await addGroup(groupData);
      }
      setShowGroupForm(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.log('Error saving group:', error);
      Alert.alert('Error', 'Failed to save group');
    }
  };

  const handleCancelGroupForm = () => {
    setShowGroupForm(false);
    setEditingGroup(undefined);
  };

  const handleGroupPress = (group: Group) => {
    router.push(`/group/${group.id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="people" size={64} color={colors.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Groups Yet</Text>
      <Text style={styles.emptyDescription}>
        Create your first group to start collaborating with others and sharing events.
      </Text>
      <Button
        text="Create Group"
        onPress={handleAddGroup}
        variant="primary"
        style={styles.createButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Groups</Text>
        </View>
        <View style={[styles.emptyState, { justifyContent: 'center' }]}>
          <Text style={styles.emptyDescription}>Loading groups...</Text>
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
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
          <Icon name="add" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {groups.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={() => handleGroupPress(group)}
                onEdit={() => handleEditGroup(group)}
                onDelete={() => handleDeleteGroup(group)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <SimpleBottomSheet
        isVisible={showGroupForm}
        onClose={handleCancelGroupForm}
      >
        <GroupForm
          group={editingGroup}
          onSave={handleSaveGroup}
          onCancel={handleCancelGroupForm}
        />
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
