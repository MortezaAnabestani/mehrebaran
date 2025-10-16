import { SettingModel } from "./setting.model";

class SettingService {
  public async findByKey(key: string) {
    return SettingModel.findOne({ key });
  }

  public async updateByKey(key: string, value: any) {
    return SettingModel.findOneAndUpdate({ key }, { $set: { value } }, { new: true, upsert: true });
  }
}

export const settingService = new SettingService();
