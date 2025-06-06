import Head from 'next/head';
import Link from 'next/link';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent } from '@/utils/content';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

// Spotlight components for homepage
import { Button } from '@/components/spotlight/Button';
import { Card } from '@/components/spotlight/Card';
import { Container } from '@/components/spotlight/Container';
import { Layout } from '@/components/spotlight/Layout';
import {
    GitHubIcon,
    LinkedInIcon,
    XIcon,
} from '@/components/spotlight/SocialIcons';

import { formatDate } from '@/utils/date';
import { getAllPosts } from '@/utils/get-posts';

// Homepage spotlight components
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function Article({ article }: { article: any }) {
  return (
    <Card as="article">
      <Card.Title href={`/blog/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.excerpt}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({ icon: Icon, ...props }: any) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Newsletter() {
  return (
    <form
      action="/thank-you"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Strategic Updates</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get insights on SEO, system architecture, and growth strategies.
      </p>
      <div className="mt-6 flex items-center">
        <span className="flex min-w-0 flex-auto p-px">
          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            required
            className="w-full appearance-none rounded-md bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/10 placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500 sm:text-sm dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400"
          />
        </span>
        <Button type="submit" className="ml-4 flex-none">
          Subscribe
        </Button>
      </div>
    </form>
  )
}

function Role({ role }: { role: any }) {
  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">{role.logo}</span>
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${role.start} until ${role.end}`}
        >
          <time>{role.start}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time>{role.end}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  let resume = [
    {
      company: 'FOUND',
      title: 'COO & Co-Founder',
      logo: 'F',
      start: '2023',
      end: '2024',
    },
    {
      company: 'Grey Matter',
      title: 'SEO Manager',
      logo: 'G',
      start: '2022',
      end: '2023',
    },
    {
      company: 'Independent Consultant',
      title: 'SEO Architect',
      logo: 'C',
      start: '2019',
      end: '2022',
    },
    {
      company: 'Various Agencies',
      title: 'SEO Specialist',
      logo: 'S',
      start: '2013',
      end: '2019',
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
      <Button href="/about" variant="secondary" className="group mt-6 w-full">
        View Full Background
      </Button>
    </div>
  )
}

function SpotlightHomepage({ posts }: { posts: any[] }) {
  const articles = posts.slice(0, 4)

  return (
    <Layout>
      <Head>
        <title>Victor Valentine Romo - Architect of Digital Systems & Scalable Growth</title>
        <meta name="description" content="I architect and implement comprehensive digital systems that drive scalable growth and establish market leadership through technical SEO, process automation, and content strategy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Architect of Digital Systems & Scalable Growth
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I don&apos;t just consult or manage projects; I architect and implement the comprehensive digital systems that drive scalable growth and establish market leadership. By integrating deep expertise in technical SEO, process automation, and content strategy, I solve complex business challenges with clear, systematic solutions.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink href="https://twitter.com/victorvalentineromo" aria-label="Follow on X" icon={XIcon} />
            <SocialLink
              href="https://github.com/victorvalentineromo"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com/in/victorvalentineromo"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

const Page: React.FC<PageComponentProps & { posts?: any[] }> = (props) => {
    const { global, posts, ...page } = props;
    const { site } = global;
    
    // Check if this is the homepage
    if (page.__metadata?.urlPath === '/') {
        return <SpotlightHomepage posts={posts || []} />;
    }
    
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);

    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <DynamicComponent {...props} />
        </>
    );
};

export function getStaticPaths() {
    const allData = allContent();
    const paths = allData.map((obj) => obj.__metadata.urlPath).filter(Boolean);
    return { paths, fallback: false };
}

export function getStaticProps({ params }) {
    const allData = allContent();
    const urlPath = '/' + (params.slug || []).join('/');
    const props = resolveStaticProps(urlPath, allData);
    
    // Add posts data for homepage
    if (urlPath === '/') {
        const posts = getAllPosts();
        return { props: { ...props, posts } };
    }
    
    return { props };
}

export default Page;
