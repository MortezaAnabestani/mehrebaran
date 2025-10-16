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
      .sort({ createdAt: -1 });
  }

  public async update(id: string, data: { content?: string; status?: string }): Promise<IComment | null> {
    return CommentModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<IComment | null> {
    return CommentModel.findByIdAndDelete(id);
  }
}

export const commentService = new CommentService();
