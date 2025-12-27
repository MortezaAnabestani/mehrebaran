import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import SmartButton from "@/components/ui/SmartButton";

interface User {
  _id: string;
  name: string;
  avatar?: string;
  headline?: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string | Date;
  user: User;
}

interface NeedCommentsProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

// --- Sub-components for cleaner structure ---

const CommentSkeleton = () => (
  <div className="flex gap-3 sm:gap-4 md:gap-5 animate-pulse p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-50/50 border border-gray-100">
    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-200 shadow-inner shrink-0"></div>
    <div className="flex-1 space-y-2 sm:space-y-3 py-0.5 sm:py-1">
      <div className="flex justify-between">
        <div className="h-3 sm:h-3.5 md:h-4 bg-gray-200 rounded w-24 sm:w-28 md:w-32"></div>
        <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-16 sm:w-18 md:w-20"></div>
      </div>
      <div className="h-12 sm:h-14 md:h-16 bg-gray-200 rounded-lg sm:rounded-xl w-full opacity-60"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-3 sm:px-4 text-center rounded-xl sm:rounded-2xl md:rounded-3xl bg-gray-50 border border-dashed border-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-5 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,1)]">
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>
    <h4 className="text-gray-700 font-bold text-base sm:text-lg mb-1.5 sm:mb-2">هنوز دیدگاهی ثبت نشده است</h4>
    <p className="text-gray-500 text-xs sm:text-sm max-w-xs leading-relaxed">
      اولین نفری باشید که تجربه یا نظر خود را در مورد این نیاز به اشتراک می‌گذارد.
    </p>
  </div>
);

const NeedComments: React.FC<NeedCommentsProps> = ({
  comments,
  commentText,
  setCommentText,
  onSubmit,
  isSubmitting,
  isLoading,
}) => {
  return (
    <section
      className="bg-[#fcfcfd] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 p-3 sm:p-4 md:p-6 lg:p-8 mt-4 sm:mt-6 md:mt-8 lg:mt-10 relative overflow-hidden"
      aria-labelledby="comments-heading"
    >
      {/* --- Header Section --- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-[#007acc]/10 flex items-center justify-center text-[#007acc]">
            <svg
              width="16"
              height="16"
              className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h3 id="comments-heading" className="font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 tracking-tight">
            نظرات کاربران
          </h3>
        </div>

        <div className="bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-xs sm:text-sm font-bold text-[#007acc] shadow-[2px_2px_8px_rgba(0,0,0,0.05),-2px_-2px_8px_rgba(255,255,255,1)] border border-gray-50">
          {comments.length > 0 ? `${comments.length} دیدگاه` : "بدون دیدگاه"}
        </div>
      </header>

      {/* --- Comment Form --- */}
      <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <form onSubmit={onSubmit} className="relative group">
          <label htmlFor="comment-textarea" className="sr-only">
            متن دیدگاه
          </label>
          <div className="relative transition-transform duration-300 focus-within:-translate-y-0.5 sm:focus-within:-translate-y-1">
            <textarea
              id="comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="دیدگاه ارزشمند خود را بنویسید..."
              className="w-full p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-100/50 border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl
                         shadow-[inset_2px_2px_6px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]
                         focus:ring-2 focus:ring-[#007acc]/20 focus:border-[#007acc] focus:bg-white
                         transition-all duration-300 resize-none text-gray-700 placeholder-gray-400
                         min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base leading-relaxed outline-none"
              disabled={isSubmitting}
            />

            {/* Decorative Corner Icon */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5 text-gray-300 pointer-events-none transition-colors duration-300 group-focus-within:text-[#007acc]/40">
              <svg
                width="18"
                height="18"
                className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 md:mt-5 flex justify-end">
            <SmartButton
              type="submit"
              variant="mblue"
              size="md"
              disabled={isSubmitting || !commentText.trim()}
              className="shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:shadow-[0_6px_20px_rgba(0,122,204,0.4)]
                         active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200 px-4 sm:px-6 md:px-8 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  در حال ارسال...
                </span>
              ) : (
                "ثبت دیدگاه"
              )}
            </SmartButton>
          </div>
        </form>
      </div>

      {/* --- Comments List --- */}
      <div aria-live="polite" className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {isLoading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment._id}
              className="group flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 transition-all duration-300 p-1 sm:p-1.5 md:p-2 rounded-xl sm:rounded-2xl md:rounded-3xl"
            >
              {/* Avatar Section */}
              <div className="hidden md:flex flex-shrink-0 pt-0.5 sm:pt-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full p-0.5 sm:p-1 bg-white shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,1)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={comment.user?.avatar || "/images/default-avatar.png"}
                      alt={comment.user?.name || "کاربر"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div
                  className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl rounded-tl-none
                              shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100
                              group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] group-hover:border-[#007acc]/20
                              transition-all duration-300 relative"
                >
                  {/* Header: Name & Date */}
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2 sm:mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg group-hover:text-[#007acc] transition-colors duration-200">
                        {comment.user?.name || "کاربر ناشناس"}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1">
                        {comment.user?.headline || "کاربر فعال شبکه"}
                      </p>
                    </div>
                    <time
                      dateTime={new Date(comment.createdAt).toISOString()}
                      className="text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-gray-100"
                    >
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  {/* Comment Body */}
                  <p className="text-gray-700 leading-6 sm:leading-7 md:leading-8 text-xs sm:text-sm md:text-[0.95rem] text-justify">{comment.content}</p>

                  {/* Actions (Hover only) */}
                  <div className="flex gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                    <button className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-[#007acc] flex items-center gap-1 sm:gap-1.5 transition-colors py-0.5 sm:py-1">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      پاسخ دادن
                    </button>
                    <button className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 sm:gap-1.5 transition-colors py-0.5 sm:py-1">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      پسندیدن
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default NeedComments;
