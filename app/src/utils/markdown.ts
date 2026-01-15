import MarkdownIt from 'markdown-it';

// Configure markdown-it with desired options
const md = new MarkdownIt({
  html: false,        // Disable HTML tags in source
  xhtmlOut: false,    // Don't use self-closing tags
  breaks: false,      // Don't convert \n to <br>
  linkify: true,      // Auto-convert URLs to links
  typographer: true,  // Enable smart quotes and other typographic replacements
  highlight: (str: string, lang: string) => {
    // We'll use Monaco for code highlighting, so just wrap in pre/code
    const langClass = lang ? ` class="language-${lang}"` : '';
    const escapedStr = md.utils.escapeHtml(str);
    return `<pre><code${langClass}>${escapedStr}</code></pre>`;
  },
});

/**
 * Parse markdown content to HTML
 */
export function parseMarkdown(content: string): string {
  return md.render(content);
}

/**
 * Parse inline markdown (no block elements)
 */
export function parseInlineMarkdown(content: string): string {
  return md.renderInline(content);
}
