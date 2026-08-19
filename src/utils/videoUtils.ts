/**
 * Extracts a YouTube embed URL from various YouTube link formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?feature=shared&v=VIDEO_ID
 */
export function getYouTubeEmbedUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already embed URL, ensure proper https format
  if (trimmed.includes('youtube.com/embed/')) {
    const cleanUrl = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
    // Strip trailing query parameters if needed or keep embed params
    return cleanUrl;
  }

  // Handle youtu.be links
  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]?.split('#')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  // Handle youtube.com/shorts/ links
  if (trimmed.includes('/shorts/')) {
    const id = trimmed.split('/shorts/')[1]?.split('?')[0]?.split('&')[0]?.split('#')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  // Handle standard watch?v= links
  if (trimmed.includes('v=')) {
    const id = trimmed.split('v=')[1]?.split('&')[0]?.split('#')[0]?.split('?')[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  // Generic YouTube regex match as fallback
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length >= 8) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return trimmed;
}

export function isValidVideoUrl(url?: string): boolean {
  if (!url || !url.trim()) return false;
  const embed = getYouTubeEmbedUrl(url);
  return embed.length > 10;
}
