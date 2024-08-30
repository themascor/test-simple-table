export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: UserType;
}

export enum UserType {
  ADMIN = 'Admin',
  DRIVER = 'Driver',
}
