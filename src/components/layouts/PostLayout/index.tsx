import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import * as React from 'react';

import { SEOHead } from '@/components/SEOHead';

import { DynamicComponent } from '@/components/components-registry';
import { Container } from '@/components/spotlight/Container';
import { Layout } from '@/components/spotlight/Layout';
import { PageComponentProps, PostLayout } from '@/types';
import HighlightedPreBlock from '@/utils/highlighted-markdown';

type ComponentProps = PageComponentProps & PostLayout;

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Component: React.FC<ComponentProps> = (props) => {
    const { title, date, author, markdownContent, media, bottomSections = [], global } = props;
    const router = useRouter();
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('MMMM D, YYYY');

    return (
        <Layout>
            <SEOHead
                title={`${title} - Victor Valentine Romo`}
                description={props.excerpt}
                type="article"
                publishedTime={dateTimeAttr}
                ogImage={media?.url}
            />
            <Container className="mt-16 lg:mt-32">
                <div className="xl:relative">
                    <div className="mx-auto max-w-2xl">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="Go back to articles"
                            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:mb-0 lg:-mt-2 xl:-top-1.5 xl:left-0 xl:mt-0"
                        >
                            <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                        </button>
                        <article>
                            <header className="flex flex-col">
                                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                                    {title}
                                </h1>
                                <time
                                    dateTime={dateTimeAttr}
                                    className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                                >
                                    <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                                    <span className="ml-3">{formattedDate}</span>
                                </time>
                            </header>
                            
                            {media && (
                                <div className="mt-8">
                                    <PostMedia media={media} />
                                </div>
                            )}
                            
                            {markdownContent && (
                                <Markdown
                                    options={{ forceBlock: true, overrides: { pre: HighlightedPreBlock } }}
                                    className="mt-8 prose dark:prose-invert"
                                >
                                    {markdownContent}
                                </Markdown>
                            )}
                        </article>
                    </div>
                </div>
            </Container>
            {bottomSections?.map((section, index) => {
                return <DynamicComponent key={index} {...section} />;
            })}
        </Layout>
    );
};
export default Component;

function PostMedia({ media }) {
    return <DynamicComponent {...media} className="w-full rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800" />;
}
