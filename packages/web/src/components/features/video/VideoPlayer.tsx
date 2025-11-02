"use client";

import { useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { IVideo } from "common-types";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
  video: IVideo;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isPlaying) {
    return (
      <div
        className="relative h-60 md:h-120 border border-mgray shadow-xs shadow-mgray cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        <OptimizedImage src={video.coverImage.desktop} alt={video.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <OptimizedImage
            src="/icons/play.svg"
            alt="play icon"
            width={90}
            height={90}
            className="transform group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-[56.25%]">
      <ReactPlayer
        url={video.videoUrl}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        controls={true}
        playing={true}
      />
    </div>
  );
}
