const fs = require('fs');
const path = require('path');
const frontmatter = require('front-matter');

const blogDir = 'content/pages/blog';

function stripHtmlTags(str) {
    if (!str) return '';

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

function updateBlogPostExcerpt(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = frontmatter(content);

        let hasChanges = false;
        const attributes = { ...parsed.attributes };

        // Check if excerpt needs updating
        if (
            !attributes.excerpt ||
            attributes.excerpt.trim() === 'Personal insights and reflections' ||
            attributes.excerpt.includes('<') ||
            attributes.excerpt.includes('style=')
        ) {
            const newExcerpt = generateExcerptFromContent(parsed.body);
            if (newExcerpt !== attributes.excerpt) {
                attributes.excerpt = newExcerpt;
                attributes.metaDescription = newExcerpt;
                hasChanges = true;
            }
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
${parsed.body}`;

            fs.writeFileSync(filePath, newFrontmatter);
            console.log(`  ✓ Updated excerpt: ${attributes.excerpt.substring(0, 60)}...`);
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
    console.log('📝 Updating blog post excerpts...\n');

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    let updatedCount = 0;

    for (const file of files) {
        if (updateBlogPostExcerpt(file)) {
            updatedCount++;
        }
    }

    console.log(`\n✅ Updated ${updatedCount} excerpts.`);
}

if (require.main === module) {
    main();
}

module.exports = { updateBlogPostExcerpt, generateExcerptFromContent };
