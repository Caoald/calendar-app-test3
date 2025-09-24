
export interface ChatMessage {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  content: string;
  type: 'text' | 'image' | 'emoji';
  timestamp: string;
  avatar?: string;
  imageUri?: string;
}

export interface ChatFormData {
  content: string;
  type: 'text' | 'image' | 'emoji';
  imageUri?: string;
}
