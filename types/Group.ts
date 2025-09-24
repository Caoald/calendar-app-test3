
export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  isPrivate: boolean;
  color: string;
  avatar?: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  username: string;
  role: 'admin' | 'member';
  joinedAt: string;
  avatar?: string;
}

export interface GroupFormData {
  name: string;
  description: string;
  isPrivate: boolean;
  color: string;
}
