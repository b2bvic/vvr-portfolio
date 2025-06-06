const fs = require('fs');
const path = require('path');

const blogDir = 'content/pages/blog';

function fixYamlQuotes(content) {
    // Simple but comprehensive approach - replace all problematic quotes in YAML values
    return content.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/m, (match, yamlContent) => {
        const lines = yamlContent.split('\n');
        const fixedLines = lines.map((line) => {
            // Handle metaDescription with nested quotes
            if (line.includes('metaDescription: ""') && line.includes('!"')) {
                return line.replace(/metaDescription: ""([^"]*)"([^"]*)"/, "metaDescription: '$1$2'");
            }

            // Fix any other fields with double nested quotes
            if (line.match(/^\s*\w+:\s*"[^"]*"[^"]*"/)) {
                return line.replace(/^(\s*\w+):\s*"([^"]*)"([^"]*)"/, "$1: '$2$3'");
            }

            return line;
        });

        return `---\n${fixedLines.join('\n')}\n---\n`;
    });
}

function processFile(filePath) {
    try {
        console.log(`Processing: ${path.basename(filePath)}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const fixed = fixYamlQuotes(content);

        if (fixed !== content) {
            fs.writeFileSync(filePath, fixed);
            console.log(`  ✓ Fixed quotes`);
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
    console.log('🔧 Final YAML quote fix...\n');

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

    console.log(`\n✅ Fixed ${fixedCount} files.`);
}

main();
