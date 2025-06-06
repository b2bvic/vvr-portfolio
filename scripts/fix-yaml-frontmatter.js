const fs = require('fs');
const path = require('path');

const blogDir = 'content/pages/blog';

function fixYamlQuotes(content) {
    let fixed = content;

    // Fix title field with nested quotes - handle all variations
    fixed = fixed.replace(/^title: "([^"]*)'([^"]*)"'$/gm, (match, p1, p2) => {
        return `title: "${p1}'${p2}"`;
    });

    fixed = fixed.replace(/^title: '([^']*'[^']*)'$/gm, (match, title) => {
        return `title: "${title}"`;
    });

    // Fix any field with nested single quotes
    fixed = fixed.replace(/^(\s*\w+): '([^']*'[^']*)'$/gm, (match, key, value) => {
        return `${key}: "${value}"`;
    });

    // Fix metaTitle with nested single quotes - convert to double quotes
    fixed = fixed.replace(/^metaTitle: '([^']*'[^']*)'$/gm, (match, title) => {
        return `metaTitle: "${title}"`;
    });

    // Fix metaDescription with nested single quotes - convert to double quotes
    fixed = fixed.replace(/^metaDescription: '([^']*'[^']*)'$/gm, (match, desc) => {
        return `metaDescription: "${desc}"`;
    });

    // Fix any remaining problematic single quotes in YAML values
    fixed = fixed.replace(/^(\s*\w+): '([^']*'[^']*)'$/gm, (match, key, value) => {
        return `${key}: "${value}"`;
    });

    // Fix malformed double quotes followed by single quotes
    fixed = fixed.replace(/^(\s*\w+): "([^"]*)"'$/gm, (match, key, value) => {
        return `${key}: "${value}"`;
    });

    // Fix standalone YAML blocks that aren't properly formatted
    fixed = fixed.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/m, (match, yamlContent) => {
        let yamlLines = yamlContent.split('\n');
        let fixedYaml = yamlLines
            .map((line) => {
                // Fix any remaining quote issues in YAML
                if (line.includes(": '") && line.includes("''")) {
                    return line.replace(/: '([^']*'[^']*)'/, ': "$1"');
                }
                // Fix malformed quotes
                if (line.includes(': "') && line.endsWith('"\'')) {
                    return line.replace(/: "([^"]*)"'$/, ': "$1"');
                }
                return line;
            })
            .join('\n');

        return `---\n${fixedYaml}\n---\n`;
    });

    return fixed;
}

function cleanupMarkdownFormatting(content) {
    let fixed = content;

    // Remove excessive line breaks (more than 2 consecutive empty lines)
    fixed = fixed.replace(/\n\s*\n\s*\n\s*\n+/g, '\n\n');

    // Fix markdown formatting issues
    fixed = fixed.replace(/^- \s*$/gm, ''); // Remove empty bullet points
    fixed = fixed.replace(/^\s*- \s*\n/gm, ''); // Remove orphaned dashes

    // Fix bold formatting
    fixed = fixed.replace(/\*\*\s*$/gm, '**');
    fixed = fixed.replace(/^- \*\*$/gm, '**');

    // Remove trailing whitespace on lines
    fixed = fixed.replace(/[ \t]+$/gm, '');

    // Ensure single trailing newline
    fixed = fixed.replace(/\n+$/, '\n');

    return fixed;
}

function fixBlogPost(filePath) {
    try {
        console.log(`Processing: ${filePath}`);

        const content = fs.readFileSync(filePath, 'utf8');
        let fixed = content;

        // Apply YAML fixes
        fixed = fixYamlQuotes(fixed);

        // Apply markdown cleanup
        fixed = cleanupMarkdownFormatting(fixed);

        // Only write if changes were made
        if (fixed !== content) {
            fs.writeFileSync(filePath, fixed);
            console.log(`  ✓ Fixed YAML and formatting issues`);
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
    console.log('🔧 Fixing YAML frontmatter issues in blog posts...\n');

    if (!fs.existsSync(blogDir)) {
        console.error(`Blog directory not found: ${blogDir}`);
        return;
    }

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    console.log(`Found ${files.length} blog post files to process\n`);

    let fixedCount = 0;

    for (const file of files) {
        if (fixBlogPost(file)) {
            fixedCount++;
        }
    }

    console.log(`\n✅ Completed! Fixed ${fixedCount} out of ${files.length} files.`);

    if (fixedCount > 0) {
        console.log('\n📝 Changes made:');
        console.log('  - Fixed nested quotes in all YAML fields');
        console.log('  - Fixed malformed quote patterns');
        console.log('  - Cleaned up markdown formatting');
        console.log('  - Removed excessive line breaks');
        console.log('  - Fixed bold formatting issues');
    }
}

main();
