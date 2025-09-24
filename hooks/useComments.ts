
import { useState, useEffect } from 'react';
import { Comment, CommentFormData } from '../types/Comment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMENTS_STORAGE_KEY = 'calendar_comments';

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load comments from storage
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);
      if (storedComments) {
        const parsedComments = JSON.parse(storedComments);
        setComments(parsedComments);
        console.log('Loaded comments:', parsedComments.length);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveComments = async (newComments: Comment[]) => {
    try {
      await AsyncStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(newComments));
      console.log('Comments saved successfully');
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  };

  const addComment = async (eventId: string, commentData: CommentFormData) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      eventId,
      text: commentData.text,
      author: commentData.author,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    await saveComments(updatedComments);
    console.log('Comment added for event:', eventId);
    return newComment;
  };

  const updateComment = async (commentId: string, commentData: Partial<Comment>) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? { ...comment, ...commentData, updatedAt: new Date().toISOString() }
        : comment
    );
    setComments(updatedComments);
    await saveComments(updatedComments);
    console.log('Comment updated:', commentId);
  };

  const deleteComment = async (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    await saveComments(updatedComments);
    console.log('Comment deleted:', commentId);
  };

  const getCommentsForEvent = (eventId: string): Comment[] => {
    return comments
      .filter(comment => comment.eventId === eventId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getCommentCount = (eventId: string): number => {
    return comments.filter(comment => comment.eventId === eventId).length;
  };

  return {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getCommentsForEvent,
    getCommentCount,
    refreshComments: loadComments,
  };
};
