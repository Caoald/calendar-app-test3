
export interface Comment {
  id: string;
  eventId: string;
  text: string;
  author: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentFormData {
  text: string;
  author: string;
}
