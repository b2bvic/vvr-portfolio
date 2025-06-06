import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  schema?: any;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  type?: 'website' | 'article' | 'profile';
}

export function SEOHead({
  title,
  description,
  ogImage,
  canonicalUrl,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  schema,
  publishedTime,
  modifiedTime,
  author = 'Victor Valentine Romo',
  type = 'website'
}: SEOHeadProps) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://victorvalentineromo.com';
  const currentUrl = canonicalUrl || `${siteUrl}${router.asPath}`;
  const defaultImage = `${siteUrl}/images/victor-headshot.jpg`;
  
  // Generate comprehensive schema markup
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: siteUrl,
          name: 'Victor Valentine Romo',
          description: 'Architect of Digital Systems & Scalable Growth',
          publisher: {
            '@id': `${siteUrl}/#person`
          },
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          ],
          inLanguage: 'en-US'
        },
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: 'Victor Valentine Romo',
          image: `${siteUrl}/images/victor-headshot.jpg`,
          description: 'SEO Systems Architect specializing in systematic digital growth and scalable optimization frameworks',
          url: siteUrl,
          sameAs: [
            'https://linkedin.com/in/b2bvic',
            'https://x.com/b2bvic',
            'https://instagram.com/b2bvic',
            'https://facebook.com/b2bvic',
            'https://tiktok.com/@b2bvic',
            'https://scalewithsearch.com',
            'https://seoforexecutives.com',
            'https://seobyrole.com'
          ],
          jobTitle: 'Founder & Search Consultant',
          worksFor: {
            '@type': 'Organization',
            name: 'Scale With Search',
            url: 'https://scalewithsearch.com'
          },
          knowsAbout: [
            'Technical SEO',
            'SEO Strategy',
            'Digital Marketing',
            'Website Optimization',
            'Content Strategy',
            'AI-Powered SEO',
            'Search Engine Optimization',
            'Digital Growth',
            'Marketing Automation',
            'Web Development'
          ],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'SEO Consultant',
            occupationLocation: {
              '@type': 'Country',
              name: 'United States'
            },
            skills: [
              'Technical SEO',
              'SEO Strategy',
              'Digital Marketing',
              'Content Optimization',
              'AI Integration',
              'Web Analytics',
              'Search Console',
              'Keyword Research',
              'Link Building',
              'Conversion Optimization'
            ]
          }
        },
        {
          '@type': type === 'article' ? 'Article' : 'WebPage',
          '@id': `${currentUrl}/#${type === 'article' ? 'article' : 'webpage'}`,
          url: currentUrl,
          name: title,
          isPartOf: {
            '@id': `${siteUrl}/#website`
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          description: description,
          breadcrumb: {
            '@id': `${currentUrl}/#breadcrumb`
          },
          inLanguage: 'en-US',
          potentialAction: [
            {
              '@type': 'ReadAction',
              target: [currentUrl]
            }
          ]
        }
      ]
    };

    // Add article-specific schema
    if (type === 'article') {
      const articleSchema = baseSchema['@graph'].find(item => item['@type'] === 'Article') as any;
      if (articleSchema) {
        articleSchema.author = {
          '@id': `${siteUrl}/#person`
        };
        articleSchema.publisher = {
          '@id': `${siteUrl}/#person`
        };
        articleSchema.headline = title;
        articleSchema.image = ogImage || defaultImage;
        articleSchema.mainEntityOfPage = {
          '@type': 'WebPage',
          '@id': currentUrl
        };
      }
    }

    // Add breadcrumb schema
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl
        }
      ]
    };

    // Add current page to breadcrumb
    const pathSegments = router.asPath.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      pathSegments.forEach((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbSchema.itemListElement.push({
          '@type': 'ListItem',
          position: index + 2,
          name: name,
          item: `${siteUrl}${path}`
        });
      });
    }

    (baseSchema['@graph'] as any[]).push(breadcrumbSchema);

    // Merge with custom schema if provided
    if (schema) {
      return { ...baseSchema, ...schema };
    }

    return baseSchema;
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* SEO Meta Tags */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:alt" content={`${title} - Victor Valentine Romo`} />
      <meta property="og:site_name" content="Victor Valentine Romo" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      {description && <meta property="twitter:description" content={description} />}
      <meta property="twitter:image" content={ogImage || defaultImage} />
      <meta property="twitter:image:alt" content={`${title} - Victor Valentine Romo`} />
      <meta property="twitter:creator" content="@b2bvic" />
      <meta property="twitter:site" content="@b2bvic" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="SEO" />
          <meta property="article:tag" content="SEO" />
          <meta property="article:tag" content="Digital Marketing" />
          <meta property="article:tag" content="Technical SEO" />
          <meta property="article:tag" content="Growth Strategy" />
        </>
      )}
      
      {/* Additional SEO tags */}
      <meta name="author" content={author} />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/victor-headshot.jpg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.svg" />
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema())
        }}
      />
    </Head>
  );
} 