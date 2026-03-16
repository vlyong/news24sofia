export interface ExtractedVideo {
  url: string;
  isIframe: boolean;
}

export function extractVideoUrl(content: string): ExtractedVideo | null {
  if (!content) return null;

  // 1. Look for direct .mp4 or .m3u8 links (priority)
  const directLinkRegex = /"(https?:\/\/[^"]+\.(mp4|m3u8))"/i;
  const directMatch = content.match(directLinkRegex);
  if (directMatch) return { url: directMatch[1], isIframe: false };

  // 2. Look for Bunny CDN direct stream URLs
  const bunnyDirectRegex = /"(https?:\/\/[^"]+b-cdn\.net\/[^"]+\.(mp4|m3u8))"/i;
  const bunnyDirectMatch = content.match(bunnyDirectRegex);
  if (bunnyDirectMatch) return { url: bunnyDirectMatch[1], isIframe: false };

  // 3. Look for YouTube/Facebook/Bunny iframes
  const iframeRegex = /<iframe[^>]+src="([^"]+)"/i;
  const iframeMatch = content.match(iframeRegex);
  if (iframeMatch) {
    const url = iframeMatch[1];
    // Check if it's a known non-direct video (embeds)
    const isKnownEmbed = url.includes('youtube.com') || 
                        url.includes('facebook.com') || 
                        url.includes('mediadelivery.net') || 
                        url.includes('vimeo.com');
    return { url, isIframe: isKnownEmbed || !url.match(/\.(mp4|m3u8)$/i) };
  }

  return null;
}
