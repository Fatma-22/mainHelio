import React, { useState } from "react";

interface YouTubeVideoPlayerProps {
  videoId: string;
  title?: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({
  videoId,
  title,
  thumbnailUrl,
  autoplay = false,
  width = "100%",
  height = "315",
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}${
    autoplay ? "?autoplay=1" : ""
  }`;

  return (
    <div className={`youtube-video-player ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-lg shadow-lg"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          aspectRatio: "16/9",
        }}
      >
        <iframe
          src={embedUrl}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />

        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {title && (
        <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
          {title}
        </h3>
      )}
    </div>
  );
};

export default YouTubeVideoPlayer;
