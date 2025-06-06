const fs = require('fs');
const path = require('path');

const blogDir = 'content/pages/blog';

function fixYamlFrontmatter(content) {
    // Extract the frontmatter block
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!frontmatterMatch) {
        return content;
    }

    const yamlContent = frontmatterMatch[1];
    const restOfContent = content.substring(frontmatterMatch[0].length);

    // Process YAML content more carefully
    const lines = yamlContent.split('\n');
    const fixedLines = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines
        if (line.trim() === '') {
            fixedLines.push(line);
            i++;
            continue;
        }

        // Handle multiline values (like excerpt: >-)
        if (line.includes(': >-')) {
            fixedLines.push(line);
            i++;
            // Process the multiline value
            while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
                const valueLine = lines[i];
                // Fix quotes in multiline value
                if (valueLine.trim().startsWith('"') && valueLine.trim().endsWith('"...')) {
                    const cleanedLine = valueLine.replace(/^(\s*)"([^"]*)"\.\.\./, '$1$2...');
                    fixedLines.push(cleanedLine);
                } else {
                    fixedLines.push(valueLine);
                }
                i++;
            }
            continue;
        }

        // Handle nested objects (like featuredImage:)
        if (line.includes(':') && !line.includes(': ') && line.endsWith(':')) {
            fixedLines.push(line);
            i++;
            // Process nested properties
            while (i < lines.length && lines[i].startsWith('  ') && lines[i].includes(':')) {
                fixedLines.push(lines[i]);
                i++;
            }
            continue;
        }

        // Handle regular key-value pairs
        if (line.includes(':') && line.includes(': ')) {
            const colonIndex = line.indexOf(': ');
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 2).trim();

            // Fix values with apostrophes wrapped in single quotes
            if (value.startsWith("'") && value.endsWith("'") && value.includes("'", 1, value.length - 1)) {
                const innerValue = value.slice(1, -1);
                fixedLines.push(`${key}: "${innerValue}"`);
            }
            // Fix values with quotes wrapped in double quotes ending with quote
            else if (value.startsWith('"') && value.endsWith('..."')) {
                const innerValue = value.slice(1, -4); // Remove opening quote and ending ..."
                fixedLines.push(`${key}: "${innerValue}..."`);
            }
            // Fix regular quoted values
            else {
                fixedLines.push(line);
            }
        } else {
            fixedLines.push(line);
        }

        i++;
    }

    // Reconstruct the content
    const fixedYaml = fixedLines.join('\n');
    return `---\n${fixedYaml}\n---\n${restOfContent}`;
}

function cleanupMarkdown(content) {
    let fixed = content;

    // Remove excessive line breaks
    fixed = fixed.replace(/\n\s*\n\s*\n\s*\n+/g, '\n\n');

    // Fix bold formatting at end of files
    fixed = fixed.replace(/\*\*\s*$/gm, '**');
    fixed = fixed.replace(/^- \*\*$/gm, '**');

    // Remove trailing whitespace
    fixed = fixed.replace(/[ \t]+$/gm, '');

    // Ensure single trailing newline
    fixed = fixed.replace(/\n+$/, '\n');

    return fixed;
}

function processFile(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        let fixed = content;

        // Apply YAML fixes
        fixed = fixYamlFrontmatter(fixed);

        // Apply markdown cleanup
        fixed = cleanupMarkdown(fixed);

        // Only write if changes were made
        if (fixed !== content) {
            fs.writeFileSync(filePath, fixed);
            console.log(`  ✓ Fixed`);
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
    console.log('🔧 Comprehensive YAML frontmatter fix (v2)...\n');

    if (!fs.existsSync(blogDir)) {
        console.error(`Blog directory not found: ${blogDir}`);
        return;
    }

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    console.log(`Processing ${files.length} blog post files\n`);

    let fixedCount = 0;

    for (const file of files) {
        if (processFile(file)) {
            fixedCount++;
        }
    }

    console.log(`\n✅ Completed! Fixed ${fixedCount} out of ${files.length} files.`);
}

main();
