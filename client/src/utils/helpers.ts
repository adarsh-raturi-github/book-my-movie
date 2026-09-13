export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function getCategoryIcon(genre: string): string {
  const iconMap: Record<string, string> = {
    Action: "🎬",
    Comedy: "😂",
    Drama: "🎭",
    "Sci-Fi": "🚀",
    Thriller: "😱",
    Romance: "💕",
    Horror: "👻",
    Animation: "🎨",
  };
  return iconMap[genre] || "🎬";
}
