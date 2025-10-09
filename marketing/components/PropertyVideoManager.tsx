import * as React from "react";
import { InboxIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PropertyVideo } from "@/types";

// Simple language detection (could be improved or passed as prop)
const getDefaultLanguage = () => {
  if (typeof window !== "undefined") {
    const lang =
      window.navigator.language || window.navigator.languages?.[0] || "en";
    if (lang.startsWith("ar")) return "ar";
  }
  return "en";
};

const translations = {
  en: {
    noVideos: "No Videos",
    addVideos: "Add YouTube videos to showcase this property.",
    pasteUrl: "Paste any YouTube URL to get started.",
    addVideo: "Add Video",
    cancel: "Cancel",
    addYouTubeVideo: "Add YouTube Video",
    videoUrlLabel: "YouTube Video URL",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    errorEnterUrl: "Please enter a YouTube URL",
    errorInvalidUrl:
      "Invalid YouTube URL. Please enter a valid YouTube video URL.",
    errorAlreadyAdded: "This YouTube video has already been added.",
    videoInfo: "YouTube Video",
    videoId: "ID",
    videoThumbnailAlt: "Video thumbnail",
  },
  ar: {
    noVideos: "لا توجد فيديوهات",
    addVideos: "أضف فيديوهات يوتيوب لعرض هذا العقار.",
    pasteUrl: "الصق أي رابط يوتيوب للبدء.",
    addVideo: "إضافة فيديو",
    cancel: "إلغاء",
    addYouTubeVideo: "إضافة فيديو يوتيوب",
    videoUrlLabel: "رابط فيديو يوتيوب",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    errorEnterUrl: "يرجى إدخال رابط يوتيوب",
    errorInvalidUrl: "رابط يوتيوب غير صالح. يرجى إدخال رابط فيديو يوتيوب صحيح.",
    errorAlreadyAdded: "تمت إضافة هذا الفيديو مسبقًا.",
    videoInfo: "فيديو يوتيوب",
    videoId: "المعرف",
    videoThumbnailAlt: "صورة مصغرة للفيديو",
  },
};

const extractYouTubeId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    // Always search for v= param
    const v = parsedUrl.searchParams.get("v");
    if (v && v.length === 11) return v;
    // fallback: check for youtu.be short links
    if (
      parsedUrl.hostname === "youtu.be" &&
      parsedUrl.pathname.length === 12 // "/{11charid}"
    ) {
      return parsedUrl.pathname.slice(1);
    }
    // fallback: check for /embed/{id}
    if (
      parsedUrl.pathname.startsWith("/embed/") &&
      parsedUrl.pathname.length === 17 // "/embed/{11charid}"
    ) {
      return parsedUrl.pathname.slice(7);
    }
  } catch {
    // Not a valid URL, fallback to regex for legacy support
    const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch) return vMatch[1];
    const beMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch) return beMatch[1];
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  }
  return null;
};

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export type PropertyVideoManagerProps = {
  loading?: boolean;
  initialVideos: PropertyVideo[];
  onVideosChange: (videos: Omit<PropertyVideo, "property_id">[]) => void;
  language: "en" | "ar";
};

export default function PropertyVideoManager({
  initialVideos = [],
  onVideosChange,
  loading = false,
  language = "en",
}: PropertyVideoManagerProps) {
  const [videos, setVideos] =
    React.useState<Omit<PropertyVideo, "property_id">[]>(initialVideos);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newVideoUrl, setNewVideoUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Language selection
  const lang = language || getDefaultLanguage();
  const t = translations[lang] || translations.en;

  // Sync videos state with initialVideos prop if it changes
  React.useEffect(() => {
    setVideos(initialVideos ?? []);
  }, [initialVideos]);

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      setError(t.errorEnterUrl);
      return;
    }

    const videoId = extractYouTubeId(newVideoUrl);
    if (!videoId) {
      setError(t.errorInvalidUrl);
      return;
    }

    // Check if this videoId is already present
    const alreadyExists = videos.some(
      (video) => extractYouTubeId(video.video_url) === videoId
    );
    if (alreadyExists) {
      setError(t.errorAlreadyAdded);
      return;
    }

    const newVideo: Omit<PropertyVideo, "property_id"> = {
      id: Date.now(), // Temporary ID for new videos
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: getYouTubeThumbnail(videoId),
    };

    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    onVideosChange?.(updatedVideos);
    setNewVideoUrl("");
    setIsAdding(false);
    setError(null);
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    onVideosChange?.(updatedVideos);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewVideoUrl("");
    setError(null);
  };

  // For RTL support
  const isRTL = lang === "ar";

  return (
    <div
      className={`space-y-4${isRTL ? " rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {!!videos?.length ? (
        <div className="space-y-4">
          {videos.map((video, index) => {
            const videoId = extractYouTubeId(video.video_url);
            return (
              <div
                key={video.id || index}
                className="flex items-start gap-4 p-4 border rounded-lg"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {/* Video Thumbnail */}
                {videoId && (
                  <div className="flex-shrink-0">
                    <img
                      src={getYouTubeThumbnail(videoId)}
                      alt={t.videoThumbnailAlt}
                      className="w-32 h-24 object-cover rounded"
                      onError={(e) => {
                        // Fallback to default thumbnail if maxres doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                )}

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {t.videoInfo} {videoId && `(${t.videoId}: ${videoId})`}
                  </div>
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {video.video_url}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(index)}
                  className="flex-shrink-0  py-2  h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5  focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex   items-center justify-center   text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs"
                  aria-label={t.cancel}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : isAdding ? null : (
        <div className="animate-in fade-in-50 flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="bg-muted flex items-center justify-center rounded-full">
              <InboxIcon className="text-muted-foreground size-10" />
            </div>
            <h2 className="text-foreground mt-6 text-xl font-semibold">
              {t.noVideos}
            </h2>
            <p className="text-muted-foreground mt-2 mb-6 max-w-prose text-center text-sm leading-6 font-normal">
              {t.addVideos}
              <br />
              {t.pasteUrl}
            </p>
          </div>
        </div>
      )}

      {/* Add Video Section */}
      {isAdding ? (
        <div className="space-y-3 p-4 border rounded-lg">
          <label
            className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            htmlFor="video-url"
          >
            {t.videoUrlLabel}
          </label>
          <input
            id="video-url"
            type="url"
            placeholder={t.videoUrlPlaceholder}
            value={newVideoUrl}
            disabled={loading}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            className={
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" +
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" +
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" +
              (error ? "border-red-500" : "")
            }
            dir={isRTL ? "rtl" : "ltr"}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddVideo}
              disabled={loading}
              className="h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 py-2 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              {t.addVideo}
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              disabled={loading}
              className="h-8 bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 py-2  focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center   text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 "
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => setIsAdding(true)}
          className="h-8  w-full bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs gap-1.5 rounded-md px-3 has-[>svg]:px-2.5 py-2  focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center   text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 "
        >
          <PlusIcon className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t.addYouTubeVideo}
        </button>
      )}
    </div>
  );
}
