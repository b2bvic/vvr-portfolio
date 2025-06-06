const fs = require('fs');
const path = require('path');
const frontmatter = require('front-matter');

const blogDir = 'content/pages/blog';

function stripHtmlTags(str) {
    if (!str) return '';

    // Remove all HTML tags and their content for certain tags
    str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Convert common HTML entities
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&#39;/g, "'");
    str = str.replace(/&apos;/g, "'");

    // Remove all HTML tags
    str = str.replace(/<[^>]*>/g, '');

    // Clean up whitespace
    str = str.replace(/\s+/g, ' ');
    str = str.trim();

    return str;
}

function formatMarkdownContent(content) {
    if (!content) return '';

    // Split content into sentences and group them into paragraphs
    const sentences = content.split(/(?<=[.!?])\s+/);
    const paragraphs = [];
    let currentParagraph = '';

    for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (!trimmed) continue;

        // Check if this looks like a heading (short, title-case, etc.)
        if (
            trimmed.length < 80 &&
            (trimmed.match(/^[A-Z][a-z]*(\s+[A-Z&][a-z]*)*$/) ||
                trimmed.match(/^[A-Z][a-z]*(\s+[A-Z&][a-z]*)*\s*&\s*[A-Z][a-z]*$/))
        ) {
            // Save current paragraph if it exists
            if (currentParagraph.trim()) {
                paragraphs.push(currentParagraph.trim());
                currentParagraph = '';
            }
            // Add as heading
            paragraphs.push(`## ${trimmed}`);
        } else {
            // Add to current paragraph
            currentParagraph += (currentParagraph ? ' ' : '') + trimmed;

            // If paragraph is getting long, consider breaking it
            if (currentParagraph.length > 400) {
                paragraphs.push(currentParagraph.trim());
                currentParagraph = '';
            }
        }
    }

    // Add any remaining paragraph
    if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.join('\n\n');
}

function htmlToMarkdown(html) {
    if (!html) return '';

    let markdown = html;

    // Convert headings
    markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
        const cleanContent = stripHtmlTags(content);
        return '\n' + '#'.repeat(parseInt(level)) + ' ' + cleanContent + '\n';
    });

    // Convert paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, (match, content) => {
        const cleanContent = stripHtmlTags(content);
        return cleanContent ? '\n' + cleanContent + '\n' : '';
    });

    // Convert line breaks
    markdown = markdown.replace(/<br[^>]*\/?>/gi, '\n');

    // Convert bold text
    markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, (match, tag, content) => {
        const cleanContent = stripHtmlTags(content);
        return `**${cleanContent}**`;
    });

    // Convert italic text
    markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, (match, tag, content) => {
        const cleanContent = stripHtmlTags(content);
        return `*${cleanContent}*`;
    });

    // Convert links
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, (match, href, content) => {
        const cleanContent = stripHtmlTags(content);
        return `[${cleanContent}](${href})`;
    });

    // Convert lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
        if (items) {
            return (
                '\n' +
                items
                    .map((item) => {
                        const cleanContent = stripHtmlTags(item.replace(/<\/?li[^>]*>/gi, ''));
                        return `- ${cleanContent}`;
                    })
                    .join('\n') +
                '\n'
            );
        }
        return '';
    });

    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        const items = content.match(/<li[^>]*>(.*?)<\/li>/gi);
        if (items) {
            return (
                '\n' +
                items
                    .map((item, index) => {
                        const cleanContent = stripHtmlTags(item.replace(/<\/?li[^>]*>/gi, ''));
                        return `${index + 1}. ${cleanContent}`;
                    })
                    .join('\n') +
                '\n'
            );
        }
        return '';
    });

    // Remove any remaining HTML tags
    markdown = stripHtmlTags(markdown);

    // Format the content with proper paragraphs
    markdown = formatMarkdownContent(markdown);

    return markdown;
}

function generateExcerptFromContent(content) {
    if (!content) return 'Personal insights and reflections';

    // Clean the content and get first meaningful paragraph
    const cleanContent = stripHtmlTags(content);

    // Remove the title if it appears at the beginning
    const lines = cleanContent.split('\n').filter((line) => line.trim());
    let contentToProcess = lines.join(' ');

    // Remove common title patterns from the beginning
    contentToProcess = contentToProcess.replace(
        /^[^.!?]*?(SEO|Mistakes|Tips|Guide|How to|Why|What|When|Where)[^.!?]*?[.!?]\s*/,
        ''
    );

    const sentences = contentToProcess.split(/[.!?]+/);

    // Get first 2-3 sentences or up to 180 characters
    let excerpt = '';
    for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (trimmed && trimmed.length > 10) {
            // Skip very short sentences
            if (excerpt.length + trimmed.length < 180) {
                excerpt += (excerpt ? '. ' : '') + trimmed;
            } else {
                break;
            }
        }
    }

    // If we still don't have a good excerpt, try to get the first substantial paragraph
    if (!excerpt || excerpt.length < 50) {
        const paragraphs = cleanContent.split('\n\n').filter((p) => p.trim().length > 50);
        if (paragraphs.length > 0) {
            excerpt = paragraphs[0].substring(0, 180);
            if (excerpt.length === 180) {
                excerpt += '...';
            }
        }
    }

    return excerpt || 'Personal insights and reflections';
}

function cleanBlogPost(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = frontmatter(content);

        let hasChanges = false;

        // Clean frontmatter
        const attributes = { ...parsed.attributes };

        // Convert HTML content to markdown first
        let markdownContent = parsed.body;
        if (markdownContent && markdownContent.includes('<')) {
            const convertedMarkdown = htmlToMarkdown(markdownContent);
            if (convertedMarkdown !== markdownContent) {
                markdownContent = convertedMarkdown;
                hasChanges = true;
            }
        } else if (markdownContent && !markdownContent.includes('\n\n')) {
            // Format content that doesn't have proper paragraph breaks
            const formattedContent = formatMarkdownContent(markdownContent);
            if (formattedContent !== markdownContent) {
                markdownContent = formattedContent;
                hasChanges = true;
            }
        }

        // Generate clean excerpt from content if current one is problematic
        if (!attributes.excerpt || attributes.excerpt.includes('<') || attributes.excerpt.includes('style=')) {
            attributes.excerpt = generateExcerptFromContent(markdownContent);
            hasChanges = true;
        } else if (typeof attributes.excerpt === 'string') {
            const cleanExcerpt = stripHtmlTags(attributes.excerpt);
            if (cleanExcerpt !== attributes.excerpt) {
                attributes.excerpt = cleanExcerpt.length > 200 ? cleanExcerpt.substring(0, 200) + '...' : cleanExcerpt;
                hasChanges = true;
            }
        }

        // Clean metaDescription
        if (
            !attributes.metaDescription ||
            attributes.metaDescription.includes('<') ||
            attributes.metaDescription.includes('style=')
        ) {
            attributes.metaDescription = attributes.excerpt;
            hasChanges = true;
        } else if (typeof attributes.metaDescription === 'string') {
            const cleanMetaDesc = stripHtmlTags(attributes.metaDescription);
            if (cleanMetaDesc !== attributes.metaDescription) {
                attributes.metaDescription =
                    cleanMetaDesc.length > 160 ? cleanMetaDesc.substring(0, 160) + '...' : cleanMetaDesc;
                hasChanges = true;
            }
        }

        // Clean title
        if (attributes.title && typeof attributes.title === 'string') {
            const cleanTitle = stripHtmlTags(attributes.title);
            if (cleanTitle !== attributes.title) {
                attributes.title = cleanTitle;
                hasChanges = true;
            }
        }

        // Clean metaTitle
        if (attributes.metaTitle && typeof attributes.metaTitle === 'string') {
            const cleanMetaTitle = stripHtmlTags(attributes.metaTitle);
            if (cleanMetaTitle !== attributes.metaTitle) {
                attributes.metaTitle = cleanMetaTitle;
                hasChanges = true;
            }
        }

        // Ensure we have required fields
        if (!attributes.title) {
            attributes.title = path
                .basename(filePath, '.md')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());
            hasChanges = true;
        }

        if (!attributes.date) {
            attributes.date = '2023-01-01';
            hasChanges = true;
        }

        if (hasChanges) {
            // Rebuild the file
            const newFrontmatter = `---
type: PostLayout
title: "${attributes.title.replace(/"/g, '\\"')}"
colors: colors-a
date: '${attributes.date}'
excerpt: >-
  ${attributes.excerpt}
featuredImage:
  type: ImageBlock
  url: /images/blog-placeholder.jpg
  altText: Personal insights and reflections
metaTitle: "${(attributes.metaTitle || attributes.title).replace(/"/g, '\\"')}"
metaDescription: "${attributes.metaDescription.replace(/"/g, '\\"')}"
---
${markdownContent}`;

            fs.writeFileSync(filePath, newFrontmatter);
            console.log(`  ✓ Cleaned HTML content and converted to markdown`);
            return true;
        } else {
            console.log(`  - No changes needed`);
            return false;
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🧹 Cleaning HTML content from blog posts...\n');

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    let cleanedCount = 0;

    for (const file of files) {
        if (cleanBlogPost(file)) {
            cleanedCount++;
        }
    }

    console.log(`\n✅ Cleaned ${cleanedCount} files.`);
}

if (require.main === module) {
    main();
}

module.exports = { cleanBlogPost, htmlToMarkdown, stripHtmlTags };
