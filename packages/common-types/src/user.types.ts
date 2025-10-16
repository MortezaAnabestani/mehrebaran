export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface IUser {
  _id: string;
  mobile: string;
  name: string;
  nationalId: string;

  profile?: {
    major: string;
    yearOfAdmission: string;
  };

  role: UserRole;

  password?: string;
  googleId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type TRegisterUserData = Pick<IUser, "mobile" | "name" | "nationalId"> & {
  profile: {
    major: string;
    yearOfAdmission: string;
  };
};
