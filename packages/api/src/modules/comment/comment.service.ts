import { IComment, CommentStatus } from "common-types";
import { CommentModel } from "./comment.model";

class CommentService {
  public async create(data: Partial<IComment>): Promise<IComment> {
    return CommentModel.create(data);
  }

  public async findByPost(postId: string): Promise<IComment[]> {
    return CommentModel.find({ post: postId, status: "approved" })
      .populate("author", "name")
      .sort({ createdAt: 1 });
  }

  public async findAll(filter: { status?: CommentStatus } = {}): Promise<IComment[]> {
    return CommentModel.find(filter)
      .populate("author", "name")
      .populate("post", "title slug")
      .populate({
        path: "parent",
        populate: { path: "author", select: "name" },
      })
      .sort({ createdAt: -1 });
  }

  public async findPending(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ comments: IComment[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      CommentModel.find({ status: "pending" })
        .populate("author", "name")
        .populate("post", "title slug")
        .populate({
          path: "parent",
          populate: { path: "author", select: "name" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CommentModel.countDocuments({ status: "pending" }),
    ]);
    return {
      comments,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async approve(id: string): Promise<IComment | null> {
    return CommentModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
  }

  public async reject(id: string): Promise<IComment | null> {
    return CommentModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
  }

  public async update(id: string, data: { content?: string; status?: string }): Promise<IComment | null> {
    return CommentModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<IComment | null> {
    return CommentModel.findByIdAndDelete(id);
  }
}

export const commentService = new CommentService();
