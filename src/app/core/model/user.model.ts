export interface User {
  userId: number;
  emailId: string;
  password: string;
  createdDate: string;
  projectName: string;
  fullName: string;
  mobileNo: string;
  extraId: number;
}

export type LoginUserDTO = Pick<User, 'emailId' | 'password'>;
export type RegisterUserDTO = Omit<User, 'createdDate' | 'extraId'>;
