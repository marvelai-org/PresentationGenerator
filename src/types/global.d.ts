// This file extends global interfaces to add missing types that cause TypeScript errors

interface ListFormatOptions {
  type?: 'conjunction' | 'disjunction' | 'unit';
  style?: 'long' | 'short' | 'narrow';
  localeMatcher?: 'lookup' | 'best fit';
}

interface ListFormat {
  format(items: string[]): string;
  formatToParts(items: string[]): Array<{ type: string; value: string }>;
  resolvedOptions(): Intl.ResolvedListFormatOptions;
}

interface ResolvedListFormatOptions {
  locale: string;
  type: 'conjunction' | 'disjunction' | 'unit';
  style: 'long' | 'short' | 'narrow';
}

declare namespace Intl {
  class ListFormat {
    constructor(locales?: string | string[], options?: ListFormatOptions);
    format(items: string[]): string;
    formatToParts(items: string[]): Array<{ type: string; value: string }>;
    resolvedOptions(): ResolvedListFormatOptions;
    static supportedLocalesOf(
      locales: string | string[],
      options?: { localeMatcher?: string }
    ): string[];
  }

  interface ListFormatOptions {
    type?: 'conjunction' | 'disjunction' | 'unit';
    style?: 'long' | 'short' | 'narrow';
    localeMatcher?: 'lookup' | 'best fit';
  }

  interface ResolvedListFormatOptions {
    locale: string;
    type: 'conjunction' | 'disjunction' | 'unit';
    style: 'long' | 'short' | 'narrow';
  }
}
