export interface MiniUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  journal_entries: Journal[];
  friends: MiniUser[];
}

export type AccessType = "private" | "public" | "custom";

export interface Journal {
  id: number;
  created_at: string;
  author: MiniUser;
  title: string;
  content: string;
  access: AccessType;
  shared_to: MiniUser[];
}

export interface FriendRequest {
  id: number;
  created_at: string;
  request_from: MiniUser;
  request_to: MiniUser;
  accepted: boolean;
}

export interface FriendsState {
  accepted_requests: FriendRequest[];
  received_requests: FriendRequest[];
  sent_requests: FriendRequest[];
  discover_friends: (User | MiniUser)[];
  loading: {
    deleting: number[]; // Track which requests are being deleted
    accepting: number[]; // Track which requests are being accepted
    sending: number[]; // Track which users we're sending requests to
  };
  error: string | null;
}

export interface JournalState {
  current: Journal | null;
  loading: boolean;
  error: string | null;
}
