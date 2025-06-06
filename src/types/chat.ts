export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  petId: string;
  petName: string;
  petPhoto: string;
  lastMessage?: Message;
  messages: Message[];
  unreadCount: number;
  isActive: boolean;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
}
