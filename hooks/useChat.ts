
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatFormData } from '../types/Chat';

const CHAT_STORAGE_KEY = 'chat_messages';

// Sample messages for demo
const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    groupId: '1',
    userId: 'user2',
    username: 'John Doe',
    content: 'Hey everyone! Ready for tomorrow\'s meeting?',
    type: 'text',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    groupId: '1',
    userId: 'user1',
    username: 'You',
    content: 'Yes, I\'ll be there! 👍',
    type: 'text',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [groupId]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`${CHAT_STORAGE_KEY}_${groupId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Load sample messages for group 1
        if (groupId === '1') {
          setMessages(sampleMessages);
          await AsyncStorage.setItem(`${CHAT_STORAGE_KEY}_${groupId}`, JSON.stringify(sampleMessages));
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.log('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const saveMessages = async (updatedMessages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(`${CHAT_STORAGE_KEY}_${groupId}`, JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  };

  const sendMessage = async (messageData: ChatFormData) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      groupId,
      userId: 'user1', // Current user ID
      username: 'You',
      ...messageData,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    await saveMessages(updatedMessages);
    return newMessage;
  };

  const deleteMessage = async (messageId: string) => {
    const updatedMessages = messages.filter(message => message.id !== messageId);
    await saveMessages(updatedMessages);
  };

  const getMessagesByDate = (date: string): ChatMessage[] => {
    return messages.filter(message => 
      message.timestamp.startsWith(date)
    );
  };

  return {
    messages,
    loading,
    sendMessage,
    deleteMessage,
    getMessagesByDate,
    refreshMessages: loadMessages,
  };
}
