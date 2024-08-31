import { User } from '../../../user-data/types/user.type';

export interface UserFormType extends User {
  rePassword: string;
}
