// src/lib/utils/sanitize.ts
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const sanitize = {
  html: (dirty: string): string => {
    return purify.sanitize(dirty, { USE_PROFILES: { html: true } });
  },

  text: (dirty: string): string => {
    return dirty.replace(/[^\w\s.,!?-]/gi, '');
  },

  filename: (dirty: string): string => {
    return dirty.replace(/[^\w.-]/gi, '_');
  }
};