
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, GroupFormData, GroupMember } from '../types/Group';

const GROUPS_STORAGE_KEY = 'groups_data';
const USER_GROUPS_STORAGE_KEY = 'user_groups_data';

// Sample groups for demo
const sampleGroups: Group[] = [
  {
    id: '1',
    name: 'Work Team',
    description: 'Team collaboration and meetings',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPrivate: false,
    color: '#4A90E2',
    members: [
      {
        id: '1',
        userId: 'user1',
        username: 'You',
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user2',
        username: 'John Doe',
        role: 'member',
        joinedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    name: 'Family Events',
    description: 'Family gatherings and celebrations',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPrivate: true,
    color: '#50C878',
    members: [
      {
        id: '3',
        userId: 'user1',
        username: 'You',
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
    ],
  },
];

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const storedGroups = await AsyncStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        // Load sample groups on first launch
        setGroups(sampleGroups);
        await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(sampleGroups));
      }
    } catch (error) {
      console.log('Error loading groups:', error);
      setGroups(sampleGroups);
    } finally {
      setLoading(false);
    }
  };

  const saveGroups = async (updatedGroups: Group[]) => {
    try {
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
      setGroups(updatedGroups);
    } catch (error) {
      console.log('Error saving groups:', error);
    }
  };

  const addGroup = async (groupData: GroupFormData) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      ...groupData,
      createdBy: 'user1', // Current user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          id: Date.now().toString(),
          userId: 'user1',
          username: 'You',
          role: 'admin',
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    const updatedGroups = [...groups, newGroup];
    await saveGroups(updatedGroups);
    return newGroup;
  };

  const updateGroup = async (groupId: string, updates: Partial<Group>) => {
    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? { ...group, ...updates, updatedAt: new Date().toISOString() }
        : group
    );
    await saveGroups(updatedGroups);
  };

  const deleteGroup = async (groupId: string) => {
    const updatedGroups = groups.filter(group => group.id !== groupId);
    await saveGroups(updatedGroups);
  };

  const joinGroup = async (groupId: string, member: Omit<GroupMember, 'id' | 'joinedAt'>) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const newMember: GroupMember = {
          ...member,
          id: Date.now().toString(),
          joinedAt: new Date().toISOString(),
        };
        return {
          ...group,
          members: [...group.members, newMember],
          updatedAt: new Date().toISOString(),
        };
      }
      return group;
    });
    await saveGroups(updatedGroups);
  };

  const leaveGroup = async (groupId: string, userId: string) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.userId !== userId),
          updatedAt: new Date().toISOString(),
        };
      }
      return group;
    });
    await saveGroups(updatedGroups);
  };

  const getGroupById = (groupId: string): Group | undefined => {
    return groups.find(group => group.id === groupId);
  };

  const getUserGroups = (): Group[] => {
    return groups.filter(group =>
      group.members.some(member => member.userId === 'user1')
    );
  };

  return {
    groups: getUserGroups(),
    loading,
    addGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getGroupById,
    refreshGroups: loadGroups,
  };
}
