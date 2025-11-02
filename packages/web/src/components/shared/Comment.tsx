"use client";

import React, { useState, useEffect } from "react";
import SmartButton from "../ui/SmartButton";
import { IComment } from "common-types";
import { getCommentsByPost, createComment } from "@/services/comment.service";

interface CommentProps {
  postId: string;
  postType: "News" | "Article" | "Video" | "Gallery";
}

const Comment: React.FC<CommentProps> = ({ postId, postType }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const fetchedComments = await getCommentsByPost(postId);
      setComments(fetchedComments);
      setIsLoading(false);
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      await createComment({
        content,
        post: postId,
        postType,
        guestName,
        guestEmail,
      });
      setFormMessage("نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.");
      setContent("");
      setGuestName("");
      setGuestEmail("");
    } catch (err) {
      setFormMessage("خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-10 w-full">
      {/* بخش نمایش کامنت‌ها */}
      <div className="flex items-center justify-center md:justify-between gap-2">
        <SmartButton>نظرات ({comments.length})</SmartButton>
        <span className="w-full h-[2.5px] bg-mblue/60"></span>
      </div>
      <div className="my-5 space-y-6">
        {isLoading ? (
          <p>در حال بارگذاری نظرات...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="p-4 border-r-4 border-mblue bg-gray-50 rounded">
              <p className="font-bold">
                {typeof comment.author !== "string" ? comment.author?.name : comment.guestName}
              </p>
              <p className="mt-2 text-gray-700">{comment.content}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          ))
        ) : (
          <p>هنوز نظری برای این مطلب ثبت نشده است. شما اولین نفر باشید!</p>
        )}
      </div>

      {/* بخش فرم ارسال کامنت */}
      <div className="flex items-center justify-center md:justify-between gap-2 mt-12">
        <SmartButton>نظر خود را بنویسید</SmartButton>
        <span className="w-full h-[2.5px] bg-mblue/60"></span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 justify-between items-center w-full my-5"
      >
        <textarea
          placeholder="نظرات شما..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full h-40 md:h-full md:w-7/10 border-[2.5px] border-mblue/60 p-2"
        />
        <div className="h-full w-full md:w-3/10 flex flex-col gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="نام (الزامی)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            className="h-12 w-full border-[2.5px] border-mblue/60 p-2"
          />
          <input
            type="email"
            placeholder="ایمیل (الزامی، نمایش داده نمی‌شود)"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
            className="h-12 w-full border-[2.5px] border-mblue/60 p-2"
          />
          <SmartButton type="submit" fullWidth={true} disabled={isSubmitting}>
            {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
          </SmartButton>
          {formMessage && <p className="mt-2 text-sm">{formMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default Comment;
