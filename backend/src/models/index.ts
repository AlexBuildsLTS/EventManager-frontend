export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  comment?: string;
  responseDate?: Date;
  emailStatus?: 'SENT' | 'ERROR';
}

export interface UserModel 
{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
  avatar?: string;
  title?: string;
  userLevel?: number;
}


export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  participantIds: string[]
  createdBy: string
  dressCode: 'FORMAL' | 'SEMIFORMAL' | 'CASUAL';
  agenda: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MEMBER'
  avatar?: string
  title?: string
  userLevel?: number
}
 
export interface EventCreateInput extends Omit<Event, 'id' | 'createdBy' | 'participantIds'> {
  participantIds: string[];
  createdBy: string;
  }

