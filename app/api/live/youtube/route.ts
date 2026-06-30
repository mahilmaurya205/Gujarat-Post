
const CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  videoUrl: string;
}

interface InvidiousVideo {
  videoId: string;
  title: string;
  published: number;
  lengthSeconds?: number;
  liveNow?: boolean;
}

// Fallback data matching the look of the channel
const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: 'A_5vL-ngK4M',
    title: 'Gujarat Post Live Broadcast - Latest Bulletins and Ground Reports',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    thumbnail: 'https://i.ytimg.com/vi/A_5vL-ngK4M/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=A_5vL-ngK4M',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Special Report: Gujarat Infrastructure and Industrial Growth 2027',
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    thumbnail: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'v1_placeholder',
    title: 'Gujarat Election 2027 Preparation and Voter Insights',
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    thumbnail: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'v2_placeholder',
    title: 'Monsoon Alert: Heavy rain forecast across Surat and South Gujarat',
    publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }
];

async function fetchFromInvidious(channelId: string): Promise<VideoItem[] | null> {
  const instances = [
    'https://inv.thepixora.com',
    'https://invidious.nerdvpn.de',
    'https://inv.nadeko.net',
    'https://yt.chocolatemoo53.com',
    'https://invidious.tiekoetter.com',
    'https://invidious.f5.si'
  ];

  for (const instance of instances) {
    try {
      const url = `${instance}/api/v1/channels/${channelId}/videos`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
        signal: AbortSignal.timeout(4000), // Timeout quickly to switch instance if one is slow or down
      });

      if (!res.ok) {
        console.warn(`Invidious instance ${instance} returned status ${res.status}`);
        continue;
      }

      const data = await res.json();
      
      if (data && Array.isArray(data.videos)) {
        const videos: VideoItem[] = (data.videos as InvidiousVideo[])
          .filter((v) => v && v.videoId && v.title && (v.lengthSeconds === undefined || v.lengthSeconds > 60 || v.liveNow) && !v.title.includes('#'))
          .map((v) => ({
            id: v.videoId,
            title: decodeHtmlEntities(v.title),
            publishedAt: typeof v.published === 'number' 
              ? new Date(v.published * 1000).toISOString() 
              : new Date().toISOString(),
            thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
            videoUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
          }));

        if (videos.length > 0) {
          console.log(`Successfully fetched ${videos.length} videos from Invidious instance: ${instance}`);
          return videos;
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch from Invidious instance ${instance}:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}

export async function GET() {
  // 1. Try Invidious first to allow duration filtering (> 60s)
  try {
    const invidiousVideos = await fetchFromInvidious(CHANNEL_ID);
    if (invidiousVideos && invidiousVideos.length > 0) {
      return Response.json({ 
        videos: invidiousVideos.slice(0, 6), 
        source: 'invidious' 
      });
    }
  } catch (invidiousError) {
    console.error('Invidious fetch failed:', invidiousError);
  }

  // 2. Fall back to RSS feed
  try {
    const res = await fetch(RSS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`YouTube RSS returned status ${res.status}`);
    }

    const xml = await res.text();
    
    // Parse using regex to avoid external dependency issues
    const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g);
    
    if (!entryMatches || entryMatches.length === 0) {
      throw new Error('No entries found in YouTube RSS XML');
    }

    const videos: VideoItem[] = [];

    for (const entry of entryMatches) {
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const thumbnailMatch = entry.match(/<media:thumbnail\s+[^>]*url="([^"]+)"/);

      // We need at least video ID and Title to make a card
      if (videoIdMatch && titleMatch) {
        const videoId = videoIdMatch[1].trim();
        const title = titleMatch[1].trim();
        
        // Filter out YouTube Shorts / Reels (they always have hashtags like #shorts or similar)
        if (title.includes('#')) {
          continue;
        }

        const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();
        const thumbnail = thumbnailMatch ? thumbnailMatch[1].trim() : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        videos.push({
          id: videoId,
          title: decodeHtmlEntities(title),
          publishedAt,
          thumbnail,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    if (videos.length === 0) {
      throw new Error('Failed to parse any videos from YouTube RSS XML');
    }

    return Response.json({ videos: videos.slice(0, 6), source: 'youtube_rss' });
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    
    return Response.json({ 
      videos: FALLBACK_VIDEOS, 
      source: 'fallback_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Basic helper to clean XML entities in title
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
