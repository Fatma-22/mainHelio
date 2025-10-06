import React, { useState } from "react";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";

interface Video {
  id: number;
  video_id: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration?: number;
  formatted_duration?: string;
  embed_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface PropertyVideoGalleryProps {
  videos: Video[];
  className?: string;
  showThumbnails?: boolean;
  maxVideos?: number;
  language: "en" | "ar";
}

const PropertyVideoGallery: React.FC<PropertyVideoGalleryProps> = ({
  videos,
  className = "",
  showThumbnails = true,
  maxVideos = 6,
  language = "en",
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    videos.find((v) => v.is_primary) || videos[0] || null
  );

  const displayVideos = videos.slice(0, maxVideos);

  if (!videos || videos.length === 0) {
    return null;
  }

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`property-video-gallery ${className}`}>
      {/* Main Video Player */}
      {selectedVideo && (
        <div className="mb-6">
          <YouTubeVideoPlayer
            language={language}
            videoId={selectedVideo.video_id}
            title={selectedVideo.title}
            thumbnailUrl={selectedVideo.thumbnail_url}
            width="100%"
            height="400"
            className="rounded-lg shadow-lg"
          />

          {selectedVideo.title && (
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVideo.title}
              </h3>
              {selectedVideo.description && (
                <p className="text-gray-600 mt-1 line-clamp-3">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video Thumbnails */}
      {showThumbnails && videos.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
                selectedVideo?.id === video.id
                  ? "ring-2 ring-blue-500 scale-105"
                  : "hover:scale-105 hover:shadow-lg"
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <img
                  src={
                    video.thumbnail_url ||
                    `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
                  }
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Duration */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}

                {/* Primary Badge */}
                {video.is_primary && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>

              {/* Video Title */}
              {video.title && (
                <div className="p-2 bg-white">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show More Button */}
      {videos.length > maxVideos && (
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Show All Videos ({videos.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyVideoGallery;
