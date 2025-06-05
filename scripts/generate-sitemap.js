const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://victorvalentineromo.com';
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Get all markdown files from the content/pages directory
const pages = glob.sync('content/pages/**/*.md');

// Convert file paths to URLs
const urls = pages.map((page) => {
    // Remove content/pages prefix and .md extension
    const path = page
        .replace('content/pages', '')
        .replace(/\.md$/, '')
        .replace(/\/index$/, '');

    // Handle root path
    const url = path === '' ? '/' : path;

    return {
        url: `${DOMAIN}${url}`,
        lastmod: new Date().toISOString().split('T')[0]
    };
});

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
        .map(
            ({ url, lastmod }) => `
    <url>
        <loc>${url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${url === DOMAIN ? '1.0' : '0.8'}</priority>
    </url>`
        )
        .join('')}
</urlset>`;

// Write sitemap to file
fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log(`Sitemap generated at ${SITEMAP_PATH}`);
