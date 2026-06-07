"use client";

import React, { useState, useEffect } from "react";
import SmartButton from "../ui/SmartButton";
import { IComment } from "common-types";
import { getCommentsByPost, createComment } from "@/services/comment.service";

interface CommentProps {
  postId: string;
  postType: "News" | "Article" | "Video" | "Gallery" | "Project";
}

const Comment: React.FC<CommentProps> = ({ postId, postType }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getCommentsByPost(postId);
        if (isMounted) {
          setComments(fetchedComments);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
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
    } catch {
      setFormMessage("خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 md:mt-10 mb-2 md:mb-6 w-full">
      {/* بخش نمایش کامنت‌ها */}
      <div className="flex items-center justify-center md:justify-between gap-2">
        <SmartButton size="md" className="text-xs min-w-fit">
          نظرات ({comments.length})
        </SmartButton>
        <span className="w-full h-[2.5px] bg-mblue/60"></span>
      </div>
      <div className="my-5 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mblue"></div>
            <p className="mt-3 text-gray-600">باران که می‌بارد، تو در راهی...رات...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-5 border-r-4 border-mblue bg-gradient-to-l from-gray-50 to-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 text-base">
                  {typeof comment.author !== "string" && comment.author && "name" in comment.author
                    ? comment.author.name
                    : comment.guestName}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-justify">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-600 font-medium">
              هنوز نظری برای این مطلب ثبت نشده است. شما اولین نفر باشید!
            </p>
          </div>
        )}
      </div>

      {/* بخش فرم ارسال کامنت */}
      <div className="flex items-center justify-center md:justify-between gap-2 mt-12">
        <SmartButton size="md" className="text-xs min-w-fit">
          نظر خود را بنویسید
        </SmartButton>
        <span className="w-full h-[2.5px] bg-mblue/60"></span>
        {formMessage && (
          <div
            className={`min-w-fit p-2 rounded-lg text-xs font-bold text-center ${
              formMessage.includes("موفقیت")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {formMessage}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 justify-between items-start w-full mt-6 mb-2 md:mb-6 md:h-[150px]"
      >
        <textarea
          placeholder="نظرات شما..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full min-h-[120px] md:min-h-full md:h-full md:w-7/10 border-2 border-mblue/40 focus:border-mblue focus:outline-none focus:ring-2 focus:ring-mblue/20 p-3 rounded-lg transition-all duration-200 resize-none"
        />
        <div className="h-full w-full md:w-3/10 flex flex-col gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="نام (الزامی)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            className="h-12 w-full border-2 border-mblue/40 focus:border-mblue focus:outline-none focus:ring-2 focus:ring-mblue/20 px-3 rounded-lg transition-all duration-200"
          />
          <input
            type="email"
            placeholder="ایمیل (الزامی، نمایش داده نمی‌شود)"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
            dir="ltr"
            className="h-12 w-full border-2 border-mblue/40 focus:border-mblue focus:outline-none focus:ring-2 focus:ring-mblue/20 px-3 rounded-lg transition-all duration-200"
          />
          <SmartButton type="submit" fullWidth={true} disabled={isSubmitting}>
            {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
          </SmartButton>
        </div>
      </form>
    </div>
  );
};

export default Comment;
