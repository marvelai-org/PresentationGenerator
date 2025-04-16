/**
 * Response format from the outline generation API
 */
export interface OutlineApiResponse {
  /** The title of the slide */
  title: string;
  /** Array of bullet points for the slide */
  bullets: string[];
}

/**
 * Parameters for generating an outline
 */
export interface GenerateOutlineParams {
  /** The topic or prompt for the presentation */
  topic: string;
  /** Number of slides to generate */
  numSlides: number;
  /** Style of the presentation */
  style: string;
  /** Language for the presentation content */
  language: string;
  /** Optional theme ID */
  themeId?: string;
  /** Optional text density (Concise, Medium, Detailed) */
  textDensity?: string;
  /** Optional image source setting */
  imageSource?: string;
  /** Optional AI model to use for generation */
  aiModel?: string;
}
