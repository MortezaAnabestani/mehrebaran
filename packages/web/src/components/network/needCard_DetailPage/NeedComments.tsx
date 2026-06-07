import React from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";

export interface NeedCommentsUser {
  _id: string;
  name: string;
  avatar?: string;
  headline?: string;
}

export interface INeedComment {
  _id: string;
  content: string;
  createdAt: string | Date;
  user: NeedCommentsUser;
}

interface NeedCommentsProps {
  comments: INeedComment[];
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
      className="relative"
      aria-labelledby="comments-heading"
    >
      {/* --- Header Section --- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-2 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <div className="flex flex-col gap-1">
          <h3 id="comments-heading" className="font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 tracking-tight flex items-center gap-2">
            <span className="text-[#007acc] text-2xl">•</span>
            نظرات و گفتگوها
          </h3>
        </div>

        <div className="bg-[#f0f2f5] px-4 py-2 rounded-xl text-sm font-bold text-[#007acc] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
          {comments.length > 0 ? `${comments.length} دیدگاه` : "بدون دیدگاه"}
        </div>
      </header>

      {/* --- Comment Form --- */}
      <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-14">
        <form onSubmit={onSubmit} className="relative group flex flex-col items-end">
          <label htmlFor="comment-textarea" className="sr-only">
            متن دیدگاه
          </label>
          <div className="w-full relative transition-transform duration-300">
            <textarea
              id="comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="دیدگاه ارزشمند خود را بنویسید..."
              className="w-full p-4 sm:p-5 md:p-6 bg-[#f0f2f5] rounded-2xl
                         shadow-[inset_6px_6px_12px_#c5c5c5,inset_-6px_-6px_12px_#ffffff]
                         focus:outline-none focus:ring-1 focus:ring-[#007acc]/20
                         transition-all duration-300 resize-none text-slate-700 placeholder-slate-400
                         min-h-[120px] sm:min-h-[140px] md:min-h-[160px] text-sm sm:text-base leading-relaxed"
              disabled={isSubmitting}
            />

            {/* Decorative Corner Icon */}
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-[#007acc]">
              <svg
                width="20"
                height="20"
                className="sm:w-6 sm:h-6"
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

          <div className="mt-4 sm:mt-5 md:mt-6 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="relative overflow-hidden group w-full sm:w-auto bg-gradient-to-r from-[#007acc] to-[#015ca8] hover:from-[#0069bd] hover:to-[#014c8a] text-white border border-white/10 shadow-[0_4px_14px_rgba(0,122,204,0.3)] hover:shadow-[0_8px_25px_rgba(0,122,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] transition-all duration-300 px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed select-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 relative z-10">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  در حال ارسال...
                </span>
              ) : (
                <span className="relative z-10">ثبت دیدگاه</span>
              )}
              {/* Premium shine overlay */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </button>
          </div>
        </form>
      </div>

      {/* --- Comments List --- */}
      <div aria-live="polite" className="space-y-6 sm:space-y-8 md:space-y-10">
        {isLoading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment._id}
              className="group flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 bg-[#f0f2f5] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] transition-all duration-300 p-3 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl"
            >
              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  {/* Header: Name & Date */}
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                         {/* Avatar Section */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full p-1 bg-[#f0f2f5] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] sm:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff]">
                                <div className="relative w-full h-full rounded-full overflow-hidden border border-white/60 shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff]">
                                    <OptimizedImage
                                    src={comment.user?.avatar || "/images/default-avatar.png"}
                                    alt={comment.user?.name || "کاربر"}
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                        <h4 className="font-extrabold text-slate-700 text-base sm:text-lg md:text-xl group-hover:text-[#007acc] transition-colors duration-300">
                            {comment.user?.name || "کاربر ناشناس"}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                            {comment.user?.headline || "کاربر فعال شبکه"}
                        </p>
                        </div>
                    </div>
                    <time
                      dateTime={new Date(comment.createdAt).toISOString()}
                      className="text-[10px] sm:text-xs font-bold text-slate-500 bg-[#f0f2f5] px-3 py-1.5 rounded-xl shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff]"
                    >
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>

                  {/* Comment Body */}
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg text-justify pl-2 sm:pl-4">{comment.content}</p>

                  {/* Actions (Hover only) */}
                  <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <button type="button" className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-[#007acc] flex items-center gap-1.5 transition-colors">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      پاسخ دادن
                    </button>
                    <button type="button" className="text-[10px] sm:text-xs font-bold text-slate-400 hover:text-[#007acc] flex items-center gap-1.5 transition-colors">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-inherit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
