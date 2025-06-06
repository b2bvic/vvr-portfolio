const fs = require('fs');
const path = require('path');

const blogDir = 'content/pages/blog';

function stripHtml(str) {
    return str
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
}

function cleanYamlContent(content) {
    return content.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/m, (match, yamlContent) => {
        const lines = yamlContent.split('\n');
        const cleanedLines = [];
        let inMultilineValue = false;
        let currentKey = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle multiline values (excerpt: >-)
            if (line.includes(': >-')) {
                cleanedLines.push(line);
                inMultilineValue = true;
                currentKey = line.split(':')[0].trim();
                continue;
            }

            // If we're in a multiline value
            if (inMultilineValue) {
                if (line.startsWith('  ') || line.trim() === '') {
                    // Clean HTML from multiline content
                    const cleanedLine = line
                        .replace(/^\s*/, '  ')
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ');
                    if (cleanedLine.trim()) {
                        cleanedLines.push(cleanedLine);
                    }
                } else {
                    inMultilineValue = false;
                    // Process this line normally
                }
            }

            if (!inMultilineValue) {
                // Handle regular key-value pairs
                if (line.includes(':') && !line.endsWith(':')) {
                    const [key, ...valueParts] = line.split(':');
                    let value = valueParts.join(':').trim();

                    // Remove HTML from description and excerpt values
                    if ((key.includes('Description') || key.includes('excerpt')) && value) {
                        value = stripHtml(value);
                        // Ensure proper quoting
                        if (value && !value.startsWith('"') && !value.startsWith("'")) {
                            value = `"${value}"`;
                        }
                        cleanedLines.push(`${key}: ${value}`);
                    } else {
                        cleanedLines.push(line);
                    }
                } else {
                    cleanedLines.push(line);
                }
            }
        }

        return `---\n${cleanedLines.join('\n')}\n---\n`;
    });
}

function processFile(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const cleaned = cleanYamlContent(content);

        if (cleaned !== content) {
            fs.writeFileSync(filePath, cleaned);
            console.log(`  ✓ Cleaned HTML and fixed YAML`);
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
    console.log('🧹 Cleaning HTML from YAML frontmatter...\n');

    const files = fs
        .readdirSync(blogDir)
        .filter((file) => file.endsWith('.md') && file !== 'index.md')
        .map((file) => path.join(blogDir, file));

    let cleanedCount = 0;

    for (const file of files) {
        if (processFile(file)) {
            cleanedCount++;
        }
    }

    console.log(`\n✅ Cleaned ${cleanedCount} files.`);
}

main();
