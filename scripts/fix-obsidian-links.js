const fs = require('fs');
const path = require('path');
const frontmatter = require('front-matter');
const { glob } = require('glob');

function fixObsidianLinks() {
    const blogDir = 'content/pages/blog';
    const files = glob.sync(`${blogDir}/*.md`);

    let fixedCount = 0;

    files.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = frontmatter(content);

        let hasChanges = false;
        const attributes = { ...parsed.attributes };

        // Fix date fields that use Obsidian links
        if (attributes.excerpt && typeof attributes.excerpt === 'string') {
            // Extract date from Obsidian link patterns
            const obsidianDatePattern = /(?:date:?:?\s*)?\[\[(\d{4}-\d{2}-\d{2})\]\]/;
            const match = attributes.excerpt.match(obsidianDatePattern);

            if (match) {
                const dateStr = match[1];
                // Use the extracted date for the date field if it's missing or malformed
                if (!attributes.date || attributes.date.includes('[[')) {
                    attributes.date = dateStr;
                    hasChanges = true;
                }

                // Create a proper excerpt from the markdown content
                const bodyContent = parsed.body.trim();
                const firstParagraph = bodyContent.split('\n\n')[0];
                const cleanExcerpt = firstParagraph
                    .replace(/\[\[.*?\]\]/g, '') // Remove all Obsidian links
                    .replace(/!?\[\[.*?\]\]/g, '') // Remove image links
                    .replace(/^#+\s*/, '') // Remove markdown headers
                    .replace(/\n/g, ' ') // Replace newlines with spaces
                    .trim();

                if (cleanExcerpt && cleanExcerpt.length > 20) {
                    attributes.excerpt =
                        cleanExcerpt.length > 200 ? cleanExcerpt.substring(0, 200) + '...' : cleanExcerpt;
                } else {
                    attributes.excerpt = `Thoughts and insights from ${dateStr}`;
                }
                hasChanges = true;
            }
        }

        // Fix metaDescription field
        if (attributes.metaDescription && typeof attributes.metaDescription === 'string') {
            if (attributes.metaDescription.includes('[[')) {
                // Use the same excerpt or create a new one
                attributes.metaDescription = attributes.excerpt || 'Personal insights and reflections';
                hasChanges = true;
            }
        }

        // Fix any other fields that might contain Obsidian links
        ['title', 'metaTitle'].forEach((field) => {
            if (attributes[field] && typeof attributes[field] === 'string' && attributes[field].includes('[[')) {
                attributes[field] = attributes[field].replace(/\[\[.*?\]\]/g, '').trim();
                hasChanges = true;
            }
        });

        // Ensure date field is clean
        if (attributes.date && typeof attributes.date === 'string' && attributes.date.includes('[[')) {
            const dateMatch = attributes.date.match(/\[\[(\d{4}-\d{2}-\d{2})\]\]/);
            if (dateMatch) {
                attributes.date = dateMatch[1];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            // Rebuild the file content
            const yamlFrontmatter = Object.keys(attributes)
                .map((key) => {
                    const value = attributes[key];
                    if (typeof value === 'string') {
                        return `${key}: "${value.replace(/"/g, '\\"')}"`;
                    } else if (typeof value === 'object') {
                        return `${key}:\n${Object.keys(value)
                            .map(
                                (subKey) =>
                                    `  ${subKey}: ${typeof value[subKey] === 'string' ? `"${value[subKey]}"` : value[subKey]}`
                            )
                            .join('\n')}`;
                    }
                    return `${key}: ${value}`;
                })
                .join('\n');

            // Clean the body content of Obsidian links
            let cleanBody = parsed.body
                .replace(/!?\[\[.*?\]\]/g, '') // Remove all Obsidian links and images
                .replace(/\n\n+/g, '\n\n') // Clean up multiple newlines
                .trim();

            const newContent = `---
type: PostLayout
title: ${attributes.title ? `"${attributes.title.replace(/"/g, '\\"')}"` : '"Untitled"'}
colors: colors-a
date: '${attributes.date || '2023-01-01'}'
excerpt: "${attributes.excerpt ? attributes.excerpt.replace(/"/g, '\\"') : 'Personal insights and reflections'}"
featuredImage:
  type: ImageBlock
  url: /images/blog-placeholder.jpg
  altText: Personal insights and reflections
metaTitle: ${attributes.metaTitle ? `"${attributes.metaTitle.replace(/"/g, '\\"')}"` : attributes.title ? `"${attributes.title.replace(/"/g, '\\"')}"` : '"Untitled"'}
metaDescription: "${attributes.metaDescription ? attributes.metaDescription.replace(/"/g, '\\"') : attributes.excerpt ? attributes.excerpt.replace(/"/g, '\\"') : 'Personal insights and reflections'}"
---
${cleanBody}`;

            fs.writeFileSync(filePath, newContent);
            fixedCount++;
            console.log(`Fixed: ${path.basename(filePath)}`);
        }
    });

    console.log(`\nFixed ${fixedCount} files with Obsidian link issues.`);
}

fixObsidianLinks();
