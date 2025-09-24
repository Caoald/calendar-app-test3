
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CommentFormData } from '../types/Comment';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface CommentInputProps {
  onAddComment: (commentData: CommentFormData) => void;
  placeholder?: string;
}

export default function CommentInput({ onAddComment, placeholder = "Add a comment..." }: CommentInputProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('You'); // In a real app, this would come from user context

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    console.log('Adding comment:', text);
    onAddComment({
      text: text.trim(),
      author,
    });
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={text.trim() ? colors.background : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.backgroundAlt,
  },
});
