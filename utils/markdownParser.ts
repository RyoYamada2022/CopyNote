// Simple Markdown to HTML parser

export const parseMarkdown = (text: string): string => {
  if (!text) return '';

  let html = text;

  // Block elements
  // Headings (H1-H3)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Horizontal Rule
  html = html.replace(/^(---|\*\*\*|___)$/gim, '<hr>');

  // Unordered Lists (simple, no nesting for this regex)
  html = html.replace(/^\s*[-*] (.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/gim, ''); // Merge consecutive lists

  // Ordered Lists (simple, no nesting for this regex)
  html = html.replace(/^\s*\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\n<ol>/gim, ''); // Merge consecutive lists
  
  // Checklist items
  html = html.replace(/- \[(x|X)\] (.*)/gim, '<div class="flex items-start gap-2"><input type="checkbox" checked disabled class="mt-1" /><span>$2</span></div>');
  html = html.replace(/- \[\s\] (.*)/gim, '<div class="flex items-start gap-2"><input type="checkbox" disabled class="mt-1" /><span>$1</span></div>');


  // Inline elements
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(/~~(.*?)~~/gim, '<s>$1</s>');

  // Inline Code
  html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

  // Paragraphs (wrap lines that are not other block elements)
  html = html.split('\n').map(line => {
    if (line.trim() === '') return '<br>';
    if (/^<(\/)?(h[1-3]|ul|ol|li|blockquote|hr|div)/.test(line.trim())) {
      return line;
    }
    return `<p>${line}</p>`;
  }).join('');
  
  // Cleanup paragraphs around block elements
  html = html.replace(/<p><(h[1-3]|ul|ol|blockquote|hr|div)/g, '<$1');
  html = html.replace(/<\/(h[1-3]|ul|ol|blockquote|hr|div)><\/p>/g, '</$1>');
  
  return html;
};
