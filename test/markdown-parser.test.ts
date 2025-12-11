import { describe, expect, it } from 'vitest';

import { parseMarkdown, stripMarkdown } from '../lib/markdown-parser.js';

describe('parseMarkdown', () => {
  it('parses frontmatter and content', () => {
    const markdown = `---
pov: "alice"
title: "First Meeting"
date: "2024-01-01"
timeline: "main"
arc: "introduction"
episode: 1
part: 1
chapter: 1
summary: "Alice meets Bob for the first time"
location: "coffee shop"
outfit: "red dress"
kink: "slow burn"
---

# Chapter 1

Alice walked into the coffee shop...`;

    const result = parseMarkdown(markdown);

    expect(result.metadata).toEqual({
      pov: 'alice',
      title: 'First Meeting',
      date: '2024-01-01',
      timeline: 'main',
      arc: 'introduction',
      episode: 1,
      part: 1,
      chapter: 1,
      summary: 'Alice meets Bob for the first time',
      location: 'coffee shop',
      outfit: 'red dress',
      kink: 'slow burn',
    });

    expect(result.content).toBe('# Chapter 1\n\nAlice walked into the coffee shop...');
  });

  it('handles optional fields', () => {
    const markdown = `---
pov: "bob"
title: "Second Thoughts"
date: "2024-01-02"
timeline: "main"
arc: "introduction"
episode: 1
part: 1
chapter: 2
summary: "Bob reflects on the meeting"
location: "park"
---

# Chapter 2

Bob sat on the bench...`;

    const result = parseMarkdown(markdown);

    expect(result.metadata.outfit).toBeUndefined();
    expect(result.metadata.kink).toBeUndefined();
    expect(result.metadata.pov).toBe('bob');
  });

  it('handles missing frontmatter', () => {
    const markdown = '# Just content\n\nNo frontmatter here.';

    const result = parseMarkdown(markdown);
    expect(result.content).toBe('# Just content\n\nNo frontmatter here.');
    expect(result.metadata).toEqual({});
  });
});

describe('stripMarkdown', () => {
  it('removes markdown syntax', () => {
    const markdown =
      '# Title\n\nThis is **bold** and *italic* text with [a link](https://example.com).';
    const result = stripMarkdown(markdown);

    expect(result).toBe('\n\nThis is bold and italic text with a link.');
  });

  it('removes bold and italic formatting', () => {
    const markdown = 'This is **bold** and *italic* text.';
    const result = stripMarkdown(markdown);

    expect(result).toBe('This is bold and italic text.');
  });

  it('removes links but keeps link text', () => {
    const markdown = 'Check [this link](https://example.com) out';
    const result = stripMarkdown(markdown);

    expect(result).toBe('Check this link out');
  });

  it('removes headers completely', () => {
    const markdown = '# Title\n\n## Subtitle\n\nContent here';
    const stripped = stripMarkdown(markdown);
    expect(stripped.trim()).toBe('Content here');
  });

  it('handles code blocks', () => {
    const markdown = 'Text before\n```\ncode here\n```\nText after';
    const result = stripMarkdown(markdown);

    expect(result).toContain('Text before');
    expect(result).toContain('Text after');
  });
});
