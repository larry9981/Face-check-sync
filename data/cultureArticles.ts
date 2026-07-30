import { Article, ARTICLES_PART1 } from './cultureArticlesPart1';
import { ARTICLES_PART2 } from './cultureArticlesPart2';

export type { Article };

export const CULTURE_ARTICLES: Article[] = [
  ...ARTICLES_PART1,
  ...ARTICLES_PART2
];
