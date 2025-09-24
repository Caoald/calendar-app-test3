
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import Icon from './Icon';
import { Group, GroupFormData } from '../types/Group';

interface GroupFormProps {
  group?: Group;
  onSave: (groupData: GroupFormData) => void;
  onCancel: () => void;
}

const colorOptions = [
  '#4A90E2', '#50C878', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C'
];

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    ...commonStyles.input,
    marginBottom: 0,
  },
  textArea: {
    ...commonStyles.input,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 0,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  privacyOptionSelected: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.primary,
  },
  privacyText: {
    flex: 1,
    marginLeft: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  privacyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});

export default function GroupForm({ group, onSave, onCancel }: GroupFormProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    isPrivate: false,
    color: colorOptions[0],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        isPrivate: group.isPrivate,
        color: group.color,
      });
    }
  }, [group]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    onSave(formData);
  };

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      {colorOptions.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            formData.color === color && styles.colorOptionSelected,
          ]}
          onPress={() => setFormData({ ...formData, color })}
        />
      ))}
    </View>
  );

  const renderPrivacyOptions = () => (
    <View>
      <TouchableOpacity
        style={[
          styles.privacyOption,
          !formData.isPrivate && styles.privacyOptionSelected,
        ]}
        onPress={() => setFormData({ ...formData, isPrivate: false })}
      >
        <Icon name="globe" size={20} color={colors.primary} />
        <View style={styles.privacyText}>
          <Text style={styles.privacyTitle}>Public</Text>
          <Text style={styles.privacyDescription}>Anyone can find and join this group</Text>
        </View>
        {!formData.isPrivate && (
          <Icon name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.privacyOption,
          formData.isPrivate && styles.privacyOptionSelected,
        ]}
        onPress={() => setFormData({ ...formData, isPrivate: true })}
      >
        <Icon name="lock-closed" size={20} color={colors.primary} />
        <View style={styles.privacyText}>
          <Text style={styles.privacyTitle}>Private</Text>
          <Text style={styles.privacyDescription}>Only invited members can join</Text>
        </View>
        {formData.isPrivate && (
          <Icon name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>
        {group ? 'Edit Group' : 'Create New Group'}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter group name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Describe your group (optional)"
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Group Color</Text>
        {renderColorPicker()}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Privacy</Text>
        {renderPrivacyOptions()}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="Cancel"
          onPress={onCancel}
          variant="secondary"
          style={styles.button}
        />
        <Button
          text={group ? 'Update' : 'Create'}
          onPress={handleSave}
          variant="primary"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}
