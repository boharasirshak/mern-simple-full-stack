export interface LoginDataType {
  email: string;
  password: string;
}

export interface SignupDataType extends LoginDataType {
  name: string;
  password: string;
}

export interface UserDataType extends Omit<SignupDataType, "password"> {
  _id: string;
  isVerified: boolean;
}
