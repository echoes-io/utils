import { describe, expect, it } from 'vitest';

import { getTextStats } from '../lib/text-stats.js';

describe('getTextStats', () => {
  it('counts words correctly', () => {
    const stats = getTextStats('Hello world this is a test');
    expect(stats.words).toBe(6);
  });

  it('counts characters with and without spaces', () => {
    const stats = getTextStats('Hello world');
    expect(stats.characters).toBe(11);
    expect(stats.charactersNoSpaces).toBe(10);
  });

  it('counts paragraphs', () => {
    const markdown = 'First paragraph\n\nSecond paragraph\n\nThird paragraph';
    const stats = getTextStats(markdown);
    expect(stats.paragraphs).toBe(3);
  });

  it('counts sentences', () => {
    const markdown = 'First sentence. Second sentence! Third sentence?';
    const stats = getTextStats(markdown);
    expect(stats.sentences).toBe(3);
  });

  it('calculates reading time', () => {
    const text = Array(200).fill('word').join(' ');
    const stats = getTextStats(text);
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('ignores frontmatter when counting', () => {
    const markdown = `---
title: "Test Chapter"
pov: "alice"
---

# Chapter Title

This is **bold** text with *italic* and a [link](url).`;

    const stats = getTextStats(markdown);
    expect(stats.words).toBe(9); // Excludes header "Chapter Title"
  });

  it('counts words with punctuation correctly', () => {
    const stats = getTextStats('Hello, world! This is a test.');
    expect(stats.words).toBe(6);
  });

  it('handles empty string', () => {
    const stats = getTextStats('');
    expect(stats.words).toBe(0);
    expect(stats.paragraphs).toBe(0);
  });
});
