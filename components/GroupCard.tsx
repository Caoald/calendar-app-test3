
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { Group } from '../types/Group';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default function GroupCard({ group, onPress, onEdit, onDelete }: GroupCardProps) {
  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={[styles.colorIndicator, { backgroundColor: group.color }]} />
          <View style={styles.content}>
            <Text style={styles.title}>{group.name}</Text>
            {group.description && (
              <Text style={styles.description} numberOfLines={2}>
                {group.description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Icon name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Icon name="trash" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.memberCount}>
          <Icon name="people" size={16} color={colors.textSecondary} />
          <Text style={styles.memberText}>
            {group.members.length} member{group.members.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {group.isPrivate && (
          <View style={styles.privateIndicator}>
            <Icon name="lock-closed" size={12} color={colors.textSecondary} />
            <Text style={styles.privateText}>Private</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
