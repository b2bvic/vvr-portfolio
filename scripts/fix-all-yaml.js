const fs = require('fs');
const path = require('path');

const blogDir = 'content/pages/blog';

function cleanString(str) {
    if (!str) return '';
    // Remove all HTML tags and entities
    return str
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function fixYamlFrontmatter(content) {
    // Extract and rebuild frontmatter completely
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!frontmatterMatch) return content;

    const restOfContent = content.substring(frontmatterMatch[0].length);
    const yamlLines = frontmatterMatch[1].split('\n');

    const newFrontmatter = {
        type: 'PostLayout',
        title: '',
        colors: 'colors-a',
        date: '',
        excerpt: '',
        featuredImage: {
            type: 'ImageBlock',
            url: '/images/blog-placeholder.jpg',
            altText: 'Personal insights and reflections'
        },
        metaTitle: '',
        metaDescription: ''
    };

    // Extract values from existing frontmatter
    let currentKey = '';
    let inMultiline = false;
    let multilineContent = '';

    for (const line of yamlLines) {
        if (line.trim() === '') continue;

        if (line.includes(': >-')) {
            currentKey = line.split(':')[0].trim();
            inMultiline = true;
            multilineContent = '';
            continue;
        }

        if (inMultiline) {
            if (line.startsWith('  ')) {
                multilineContent += ' ' + cleanString(line.trim());
            } else {
                // End of multiline, save content
                if (currentKey === 'excerpt') {
                    newFrontmatter.excerpt = multilineContent.trim() + '...';
                }
                inMultiline = false;
                // Process current line normally
            }
        }

        if (!inMultiline && line.includes(': ')) {
            const [key, ...valueParts] = line.split(': ');
            const value = valueParts.join(': ').trim();
            const cleanKey = key.trim();
            const cleanValue = cleanString(value.replace(/^["']|["']$/g, ''));

            if (cleanKey === 'title') newFrontmatter.title = cleanValue;
            else if (cleanKey === 'date') newFrontmatter.date = cleanValue;
            else if (cleanKey === 'metaTitle') newFrontmatter.metaTitle = cleanValue;
            else if (cleanKey === 'metaDescription') newFrontmatter.metaDescription = cleanValue;
        }
    }

    // Build clean YAML
    const cleanYaml = `---
type: PostLayout
title: "${newFrontmatter.title}"
colors: colors-a
date: '${newFrontmatter.date}'
excerpt: >-
  ${newFrontmatter.excerpt}
featuredImage:
  type: ImageBlock
  url: /images/blog-placeholder.jpg
  altText: Personal insights and reflections
metaTitle: "${newFrontmatter.metaTitle}"
metaDescription: "${newFrontmatter.metaDescription}"
---
`;

    return cleanYaml + restOfContent;
}

function processFile(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = fixYamlFrontmatter(content);

        if (fixed !== content) {
            fs.writeFileSync(filePath, fixed);
            console.log(`  ✅ Completely rebuilt YAML`);
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
    console.log('🔧 ULTIMATE YAML FRONTMATTER FIX - Rebuilding all frontmatter...\n');

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    let fixedCount = 0;

    for (const file of files) {
        if (processFile(file)) {
            fixedCount++;
        }
    }

    console.log(`\n✅ COMPLETED! Rebuilt ${fixedCount} files with clean YAML frontmatter.`);
    console.log('All HTML removed, quotes fixed, YAML structure standardized.');
}

main();
