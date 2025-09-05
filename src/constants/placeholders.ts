// Interface for the placeholder structure
interface PlaceholderImages {
  poster: string;
  backdrop: string;
}

// Export constant for coming soon placeholders
export const COMING_SOON_PLACEHOLDERS: PlaceholderImages = {
  poster: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="300" height="450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-size="24" font-family="Arial, sans-serif" font-weight="bold">
        🎬
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="18" font-family="Arial, sans-serif">
        Coming Soon
      </text>
    </svg>
  `)}`,

  backdrop: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad2)"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">
        🎬
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="32" font-family="Arial, sans-serif">
        Coming Soon
      </text>
    </svg>
  `)}`,
};