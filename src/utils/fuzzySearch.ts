/**
 * Fuzzy Search & Match Highlighting Utility
 */

import type { SearchResultItem, GroupedSearchResults } from '@/types/search';

export interface MatchSegment {
  text: string;
  isMatch: boolean;
}

/**
 * Calculates fuzzy score for a single target string against a query.
 * Returns score (0 to 100) where 0 is no match.
 */
export function calculateFuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;

  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();

  if (q === t) return 100;
  if (t.startsWith(q)) return 90;

  const words = t.split(/[\s_\-./\\]+/);
  if (words.some((word) => word.startsWith(q))) return 85;

  const substringIndex = t.indexOf(q);
  if (substringIndex !== -1) {
    const penalty = Math.min(substringIndex * 2, 20);
    return 75 - penalty;
  }

  // Tokenized multi-word search
  const queryTokens = q.split(/\s+/).filter(Boolean);
  if (queryTokens.length > 1) {
    let matches = 0;
    for (const token of queryTokens) {
      if (t.includes(token)) {
        matches++;
      }
    }
    if (matches === queryTokens.length) return 70;
    if (matches > 0) return Math.round((matches / queryTokens.length) * 50);
  }

  // Fuzzy character sequence matching
  let qIdx = 0;
  let tIdx = 0;
  let consecutiveCount = 0;
  let score = 0;

  while (qIdx < q.length && tIdx < t.length) {
    if (q[qIdx] === t[tIdx]) {
      qIdx++;
      consecutiveCount++;
      score += 5 + consecutiveCount * 3;
    } else {
      consecutiveCount = 0;
    }
    tIdx++;
  }

  if (qIdx === q.length) {
    // All query chars were matched in sequence
    const coverage = q.length / t.length;
    return Math.min(Math.round(score * coverage * 1.5), 65);
  }

  return 0;
}

/**
 * Score a SearchResultItem based on multiple weighted fields
 */
export function scoreSearchItem(item: SearchResultItem, query: string): number {
  if (!query.trim()) return 0;

  const titleScore = calculateFuzzyScore(query, item.title) * 3.0;
  const subtitleScore = item.subtitle ? calculateFuzzyScore(query, item.subtitle) * 1.8 : 0;
  const descriptionScore = item.description
    ? calculateFuzzyScore(query, item.description) * 1.2
    : 0;
  const emailScore = item.email ? calculateFuzzyScore(query, item.email) * 2.0 : 0;
  const roleScore = item.role ? calculateFuzzyScore(query, item.role) * 1.5 : 0;
  const categoryScore = calculateFuzzyScore(query, item.category) * 1.0;

  let tagScore = 0;
  if (item.tags && item.tags.length > 0) {
    const bestTag = Math.max(...item.tags.map((t) => calculateFuzzyScore(query, t)));
    tagScore = bestTag * 2.2;
  }

  const maxScore = Math.max(
    titleScore,
    subtitleScore,
    descriptionScore,
    emailScore,
    roleScore,
    categoryScore,
    tagScore
  );

  return maxScore;
}

/**
 * Filter and group search items by category using fuzzy score thresholding
 */
export function fuzzyGroupSearch(
  items: SearchResultItem[],
  query: string,
  minScore = 15
): GroupedSearchResults {
  const emptyGroups: GroupedSearchResults = {
    projects: [],
    tasks: [],
    users: [],
    activities: [],
  };

  if (!query || !query.trim()) {
    return emptyGroups;
  }

  const trimmedQuery = query.trim();

  const scoredItems = items
    .map((item) => ({
      ...item,
      score: scoreSearchItem(item, trimmedQuery),
    }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const result: GroupedSearchResults = {
    projects: [],
    tasks: [],
    users: [],
    activities: [],
  };

  for (const item of scoredItems) {
    if (result[item.category]) {
      result[item.category].push(item);
    }
  }

  return result;
}

/**
 * Break text into segments of matched and non-matched substrings for highlighting
 */
export function getHighlightSegments(text: string, query: string): MatchSegment[] {
  if (!text) return [];
  if (!query || !query.trim()) return [{ text, isMatch: false }];

  const q = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();

  // Find exact substring match first
  const matchRanges: [number, number][] = [];

  // Search for whole query or query tokens
  const tokens = [q, ...q.split(/\s+/).filter((t) => t.length > 1)];

  for (const token of tokens) {
    let startIdx = 0;
    while ((startIdx = lowerText.indexOf(token, startIdx)) !== -1) {
      matchRanges.push([startIdx, startIdx + token.length]);
      startIdx += Math.max(1, token.length);
    }
  }

  if (matchRanges.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Sort & merge overlapping ranges
  matchRanges.sort((a, b) => a[0] - b[0]);
  const mergedRanges: [number, number][] = [];

  for (const range of matchRanges) {
    if (mergedRanges.length === 0) {
      mergedRanges.push(range);
    } else {
      const prev = mergedRanges[mergedRanges.length - 1];
      if (range[0] <= prev[1]) {
        prev[1] = Math.max(prev[1], range[1]);
      } else {
        mergedRanges.push(range);
      }
    }
  }

  // Build segments
  const segments: MatchSegment[] = [];
  let currentIdx = 0;

  for (const [start, end] of mergedRanges) {
    if (start > currentIdx) {
      segments.push({ text: text.slice(currentIdx, start), isMatch: false });
    }
    segments.push({ text: text.slice(start, end), isMatch: true });
    currentIdx = end;
  }

  if (currentIdx < text.length) {
    segments.push({ text: text.slice(currentIdx), isMatch: false });
  }

  return segments;
}
