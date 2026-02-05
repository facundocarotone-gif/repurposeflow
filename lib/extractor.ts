import * as cheerio from 'cheerio';
import { ExtractResponse } from '@/types';

export async function extractContent(url: string): Promise<ExtractResponse> {
  // Fetch the page
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RepurposeFlow/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script, style, nav, footer, header, aside, .sidebar, .ads, .comments, .social-share, .related-posts, noscript, iframe').remove();

  // Extract title
  let title = '';
  const titleSources = [
    'h1',
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'title',
  ];

  for (const selector of titleSources) {
    if (selector.startsWith('meta')) {
      title = $(selector).attr('content') || '';
    } else {
      title = $(selector).first().text().trim();
    }
    if (title) break;
  }

  // Extract main content
  let content = '';
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    'main',
    '.post',
    '.blog-post',
  ];

  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length) {
      content = element.text().trim();
      break;
    }
  }

  // Fallback: get body text
  if (!content) {
    content = $('body').text().trim();
  }

  // Clean up whitespace
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  // Calculate word count
  const word_count = content.split(/\s+/).filter(Boolean).length;

  // Create excerpt
  const excerpt = content.slice(0, 200) + (content.length > 200 ? '...' : '');

  return {
    title: title || 'Untitled',
    content,
    excerpt,
    word_count,
  };
}
