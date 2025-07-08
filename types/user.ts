export interface User {
    id: string;
    email: string;
    role: UserRole;
    avatar?: string;
  }
  
  export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
  }