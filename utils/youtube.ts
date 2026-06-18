export type YouTubeClip = {
  youtubeUrl: string;
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
};

function normalizeSeconds(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return undefined;
  return value;
}

export function getYouTubeVideoId(youtubeUrl: string | undefined): string | null {
  if (!youtubeUrl) return null;

  try {
    const url = new URL(youtubeUrl);
    const hostname = url.hostname.replace(/^www\./, '').replace(/^m\./, '');

    if (hostname === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v');

      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'embed' && parts[1]) return parts[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizeYouTubeClip(
  video:
    | {
        youtubeUrl?: string;
        startSeconds?: number;
        endSeconds?: number;
      }
    | undefined
): YouTubeClip | undefined {
  const videoId = getYouTubeVideoId(video?.youtubeUrl);
  if (!video?.youtubeUrl || !videoId) return undefined;

  const startSeconds = normalizeSeconds(video.startSeconds);
  const endSeconds = normalizeSeconds(video.endSeconds);
  const effectiveStartSeconds = startSeconds ?? 0;

  if (endSeconds != null && endSeconds <= effectiveStartSeconds) {
    return undefined;
  }

  return {
    youtubeUrl: video.youtubeUrl,
    videoId,
    startSeconds,
    endSeconds,
  };
}
