
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import * as ImagePicker from 'expo-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import { ChatFormData } from '../types/Chat';

interface ChatInputProps {
  onSendMessage: (messageData: ChatFormData) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 80,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  emojiContainer: {
    height: 250,
    backgroundColor: colors.background,
  },
});

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({
        content: message.trim(),
        type: 'text',
      });
      setMessage('');
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onSendMessage({
          content: 'Image',
          type: 'image',
          imageUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onSendMessage({
      content: emoji,
      type: 'emoji',
    });
    setShowEmojiPicker(false);
  };

  if (showEmojiPicker) {
    return (
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEmojiPicker(false)}
          >
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emojiContainer}>
          <EmojiSelector
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={false}
            showTabs={true}
            showHistory={true}
            category="all"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowEmojiPicker(true)}
        >
          <Icon name="happy" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleImagePicker}
        >
          <Icon name="image" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          !message.trim() && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Icon name="send" size={20} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
}
