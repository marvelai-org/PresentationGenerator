/**
 * Default slide template with empty title and bullet point
 */
export const DEFAULT_SLIDE_TEMPLATE = '<h2></h2><ul><li></li></ul>';

/**
 * Default slide template with placeholder title and bullet point
 */
export const DEFAULT_SLIDE_WITH_PLACEHOLDER =
  '<h2>New slide</h2><ul><li>New bullet point</li></ul>';

/**
 * Convert a plain text string to a structured slide content
 *
 * @param content Plain text content
 * @returns Formatted HTML slide content
 */
export const formatPlainTextToSlide = (content: string): string => {
  if (!content || content.trim() === '') {
    return DEFAULT_SLIDE_WITH_PLACEHOLDER;
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
 * Default slide count options
 */
export const slideCountOptions = [
  '4 cards',
  '8 cards',
  '9 cards',
  '12 cards',
  '16 cards',
  '20 cards',
];
