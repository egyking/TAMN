export const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?#]+)/,
    /\/embed\/([^?#]+)/,
    /\/shorts\/([^?#]+)/,
    /\/v\/([^?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const getYouTubeThumbnail = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

export const getEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&hl=ar`;

export const isYouTubeUrl = (url) => /youtube\.com|youtu\.be/.test(url || '');
export const isGDriveUrl = (url) => /drive\.google\.com/.test(url || '');

export const isYouTubeChannelLiveUrl = (url) => /\/embed\/live_stream\?channel=/.test(url || '');

export const getYouTubeEmbedSrc = (url) => {
  if (isYouTubeChannelLiveUrl(url)) {
    return `${url}&autoplay=1&hl=ar`;
  }
  return getEmbedUrl(extractYouTubeId(url));
};

export const getGDriveEmbedUrl = (url) => {
  const match = url.match(/\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
};
