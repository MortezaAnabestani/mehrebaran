import { Schema, model, Types } from "mongoose";
import { IFollow } from "common-types";

const followSchema = new Schema<IFollow>(
  {
    follower: { type: Types.ObjectId, ref: "User", required: true, index: true },
    following: { type: Types.ObjectId, ref: "User", index: true },
    followType: {
      type: String,
      enum: ["user", "need"],
      required: true,
    },
    followedNeed: { type: Types.ObjectId, ref: "Need", index: true },
  },
  { timestamps: true }
);

// ======================= تغییرات اصلی در این بخش است =======================
// ایندکس ترکیبی برای دنبال کردن کاربر، فقط زمانی که فیلد `following` وجود دارد
followSchema.index(
  { follower: 1, following: 1 },
  { unique: true, partialFilterExpression: { following: { $exists: true } } }
);

// ایندکس ترکیبی برای دنبال کردن نیاز، فقط زمانی که فیلد `followedNeed` وجود دارد
followSchema.index(
  { follower: 1, followedNeed: 1 },
  { unique: true, partialFilterExpression: { followedNeed: { $exists: true } } }
);
// ========================================================================

followSchema.index({ followType: 1, following: 1 });
followSchema.index({ followType: 1, followedNeed: 1 });

// Validation: Either following or followedNeed must be set based on followType
followSchema.pre("save", function (next) {
  if (this.followType === "user" && !this.following) {
    return next(new Error("following user is required for user follow type"));
  }
  if (this.followType === "need" && !this.followedNeed) {
    return next(new Error("followedNeed is required for need follow type"));
  }
  next();
});

export const FollowModel = model<IFollow>("Follow", followSchema);
