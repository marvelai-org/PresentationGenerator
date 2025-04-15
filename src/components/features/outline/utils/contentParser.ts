/**
 * Formats plain text to structured slide HTML content
 *
 * @param content - Plain text content
 * @returns Formatted HTML slide content
 */
export const formatPlainTextToSlide = (content: string): string => {
  if (!content || content.trim() === '') {
    return '<h2>New slide</h2><ul><li>New bullet point</li></ul>';
  }

  const lines = content.split('\n');
  const title = lines[0] || 'New slide';
  const bullets = lines.slice(1).filter(line => line.trim());

  let structuredContent = `<h2>${title}</h2>`;

  if (bullets.length > 0) {
    structuredContent += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
  } else {
    structuredContent += '<ul><li></li></ul>';
  }

  return structuredContent;
};

/**
 * Extracts plain text from HTML content
 *
 * @param html - HTML content
 * @returns Plain text without HTML tags
 */
export const extractPlainTextFromHtml = (html: string): string => {
  // Basic HTML tag removal
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Truncates text to a specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + suffix;
};

/**
 * Converts API response format to slide content
 *
 * @param title - Slide title
 * @param bullets - Array of bullet points
 * @returns Formatted HTML slide content
 */
export const formatApiResponseToSlideContent = (title: string, bullets: string[]): string => {
  const bulletPoints = bullets.map(bullet => `<li>${bullet}</li>`).join('');

  return `<h2>${title}</h2><ul>${bulletPoints}</ul>`;
};
