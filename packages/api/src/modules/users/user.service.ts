import { IUser } from "common-types";
import { UserModel } from "./user.model";

class UserService {
  public async findUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("-password");
  }

  public async findAllUsers(): Promise<IUser[]> {
    return UserModel.find().select("-password");
  }
}

export const userService = new UserService();
