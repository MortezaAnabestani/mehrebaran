"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import StoryCard from "@/components/stories/StoryCard";
import StoryViewer from "@/components/stories/StoryViewer";
import MediaUploader from "@/components/media/MediaUploader";
import SmartButton from "@/components/ui/SmartButton";
import storyService, { type CreateStoryData } from "@/services/story.service";
import type { IStory, IStoryFeedItem } from "@mehrebaran/common-types";

// ===========================
// Stories Page Component
// ===========================

const StoriesPage: React.FC = () => {
  const router = useRouter();

  // State
  const [storyFeed, setStoryFeed] = useState<IStoryFeedItem[]>([]);
  const [myStories, setMyStories] = useState<IStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [viewerStories, setViewerStories] = useState<IStory[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState<number>(0);

  // Create story form
  const [storyType, setStoryType] = useState<"image" | "video" | "text">("image");
  const [storyText, setStoryText] = useState<string>("");
  const [storyCaption, setStoryCaption] = useState<string>("");
  const [storyBackgroundColor, setStoryBackgroundColor] = useState<string>("#3b80c3");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // ===========================
  // Data Fetching
  // ===========================

  const fetchStories = async () => {
    try {
      setIsLoading(true);

      const [feedRes, myStoriesRes] = await Promise.all([
        storyService.getStoryFeed(20),
        storyService.getMyStories(),
      ]);

      setStoryFeed(feedRes.data.items);
      setMyStories(myStoriesRes.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // ===========================
  // Event Handlers
  // ===========================

  const handleStoryClick = (feedItem: IStoryFeedItem, index: number = 0) => {
    setViewerStories(feedItem.stories);
    setViewerInitialIndex(index);
    setShowViewer(true);
  };

  const handleMyStoryClick = () => {
    if (myStories.length > 0) {
      setViewerStories(myStories);
      setViewerInitialIndex(0);
      setShowViewer(true);
    }
  };

  const handleMediaUpload = (mediaIds: string[]) => {
    if (mediaIds.length > 0) {
      // In a real app, you'd get the media URL from the server response
      // For now, we'll just mark that media is uploaded
      setUploadedMediaUrl(`/media/${mediaIds[0]}`);
    }
  };

  const handleCreateStory = async () => {
    try {
      setIsCreating(true);

      const storyData: CreateStoryData = {
        type: storyType,
        caption: storyCaption,
        privacy: "followers",
        allowReplies: true,
        allowSharing: true,
      };

      if (storyType === "text") {
        storyData.text = storyText;
        storyData.backgroundColor = storyBackgroundColor;
        storyData.textColor = "#ffffff";
      } else if (uploadedMediaUrl) {
        storyData.media = {
          type: storyType,
          url: uploadedMediaUrl,
        };
      } else {
        alert("لطفاً یک رسانه آپلود کنید.");
        return;
      }

      await storyService.createStory(storyData);

      // Reset form
      setShowCreateModal(false);
      setStoryText("");
      setStoryCaption("");
      setUploadedMediaUrl("");
      setStoryType("image");

      // Refresh stories
      fetchStories();

      alert("✓ استوری شما با موفقیت منتشر شد!");
    } catch (error: any) {
      console.error("Error creating story:", error);
      alert(error.response?.data?.message || "خطا در ایجاد استوری. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این استوری را حذف کنید؟")) {
      return;
    }

    try {
      await storyService.deleteStory(storyId);
      fetchStories();
      alert("✓ استوری با موفقیت حذف شد.");
    } catch (error: any) {
      console.error("Error deleting story:", error);
      alert("خطا در حذف استوری.");
    }
  };

  // ===========================
  // Render
  // ===========================

  const backgroundColors = [
    "#3b80c3",
    "#ff9434",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#009688",
    "#4caf50",
    "#ff5722",
    "#795548",
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mt-8 bg-mblue p-2 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">روایت مهر</h1>
                <p className="text-gray-100">استوری‌های 24 ساعته از دوستان و همکاران</p>
              </div>

              <SmartButton onClick={() => setShowCreateModal(true)} variant="morange" size="md">
                ایجاد استوری
              </SmartButton>
            </div>
          </div>

          {/* Stories Feed */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border-4 border-mblue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">در حال بارگذاری استوری‌ها...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* My Stories */}
              {myStories.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">استوری‌های من</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {myStories.map((story, index) => (
                      <div key={story._id} className="relative">
                        <StoryCard story={story} hasUnviewed={false} onClick={handleMyStoryClick} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStory(story._id);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                          title="حذف استوری"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friends Stories */}
              {storyFeed.length > 0 ? (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">استوری‌های دوستان</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {storyFeed.map((feedItem) => (
                      <StoryCard
                        key={feedItem.user._id}
                        story={feedItem.stories[0]}
                        hasUnviewed={feedItem.hasUnviewed}
                        onClick={() => handleStoryClick(feedItem)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-lg mb-2">استوری جدیدی وجود ندارد</p>
                  <p className="text-gray-400 text-sm">
                    دوستان خود را دنبال کنید تا استوری‌های آن‌ها را ببینید
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">ایجاد استوری جدید</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Story Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">نوع استوری:</label>
                <div className="flex gap-2">
                  {(["image", "video", "text"] as const).map((type) => (
                    <SmartButton
                      key={type}
                      onClick={() => setStoryType(type)}
                      variant={storyType === type ? "morange" : "mgray"}
                      size="sm"
                    >
                      {type === "image" ? "تصویر" : type === "video" ? " ویدئو" : " متن"}
                    </SmartButton>
                  ))}
                </div>
              </div>

              {/* Content */}
              {storyType === "text" ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">متن استوری:</label>
                    <textarea
                      value={storyText}
                      onChange={(e) => setStoryText(e.target.value)}
                      placeholder="متن استوری خود را بنویسید..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mblue focus:border-transparent"
                      rows={4}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">{storyText.length}/200 کاراکتر</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رنگ پس‌زمینه:</label>
                    <div className="flex gap-2 flex-wrap">
                      {backgroundColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setStoryBackgroundColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-transform ${
                            storyBackgroundColor === color ? "border-gray-900 scale-110" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">پیش‌نمایش:</label>
                    <div
                      className="w-full h-64 rounded-lg flex items-center justify-center p-6"
                      style={{
                        backgroundColor: storyBackgroundColor,
                        color: "#ffffff",
                      }}
                    >
                      <p className="text-2xl text-center font-bold">{storyText || "متن استوری شما..."}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    آپلود {storyType === "image" ? "تصویر" : "ویدئو"}:
                  </label>
                  <MediaUploader
                    category="story"
                    allowedTypes={[storyType]}
                    maxSize={storyType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024}
                    maxFiles={1}
                    multiple={false}
                    onUploadComplete={handleMediaUpload}
                    generateThumbnails={true}
                  />
                </div>
              )}

              {/* Caption */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">توضیحات (اختیاری):</label>
                <input
                  type="text"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  placeholder="توضیحات کوتاهی بنویسید..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mblue focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <SmartButton
                  onClick={handleCreateStory}
                  variant="morange"
                  size="lg"
                  className="flex-1"
                  disabled={isCreating || (storyType === "text" ? !storyText.trim() : !uploadedMediaUrl)}
                >
                  {isCreating ? "در حال انتشار..." : "انتشار استوری"}
                </SmartButton>
                <SmartButton
                  onClick={() => setShowCreateModal(false)}
                  variant="mgray"
                  size="lg"
                  disabled={isCreating}
                >
                  انصراف
                </SmartButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showViewer && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={viewerInitialIndex}
          onClose={() => setShowViewer(false)}
        />
      )}
    </ProtectedRoute>
  );
};

export default StoriesPage;
