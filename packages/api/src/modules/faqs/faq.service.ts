import { IFaq } from "common-types";
import { FaqModel } from "./faq.model";

class FaqService {
  public async create(data: Omit<IFaq, "_id" | "createdAt" | "updatedAt">): Promise<IFaq> {
    return FaqModel.create(data);
  }

  public async findAll(): Promise<IFaq[]> {
    return FaqModel.find().sort({ order: 1, createdAt: -1 });
  }

  public async findAllActive(): Promise<IFaq[]> {
    return FaqModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  }

  public async findById(id: string): Promise<IFaq | null> {
    return FaqModel.findById(id);
  }

  public async update(id: string, data: Partial<IFaq>): Promise<IFaq | null> {
    return FaqModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<void> {
    await FaqModel.findByIdAndDelete(id);
  }
}

export const faqService = new FaqService();
