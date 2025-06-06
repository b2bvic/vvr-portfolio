import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';

import { DynamicComponent } from '@/components/components-registry';
import { Container } from '@/components/spotlight/Container';
import { Layout } from '@/components/spotlight/Layout';
import {
    GitHubIcon,
    LinkedInIcon,
    XIcon,
} from '@/components/spotlight/SocialIcons';
import { PageComponentProps, PageLayout } from '@/types';

type ComponentProps = PageComponentProps & PageLayout;

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

const Component: React.FC<ComponentProps> = (props) => {
    const { sections = [], title, markdownContent } = props;

    // Check if this is the About page
    if (props.__metadata?.urlPath === '/about-me') {
        return (
            <Layout>
                <Head>
                    <title>About - Victor Valentine Romo</title>
                    <meta
                        name="description"
                        content="I&apos;m Victor Valentine Romo, an architect of digital systems and scalable growth solutions."
                    />
                </Head>
                <Container className="mt-16 sm:mt-32">
                    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
                        <div className="lg:pl-20">
                            <div className="max-w-xs px-2.5 lg:max-w-none">
                                <img
                                    src="/images/avatar.jpg"
                                    alt="Victor Valentine Romo"
                                    className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                                />
                            </div>
                        </div>
                        <div className="lg:order-first lg:row-span-2">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                                I&apos;m Victor Valentine Romo. I architect digital systems that drive scalable growth.
                            </h1>
                            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                                <div
                                    className="prose dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: markdownContent }}
                                />
                            </div>
                        </div>
                        <div className="lg:pl-20">
                            <ul role="list">
                                <SocialLink href="https://twitter.com/victorvalentineromo" icon={XIcon}>
                                    Follow on X
                                </SocialLink>
                                <SocialLink href="https://github.com/victorvalentineromo" icon={GitHubIcon} className="mt-4">
                                    Follow on GitHub
                                </SocialLink>
                                <SocialLink href="https://linkedin.com/in/victorvalentineromo" icon={LinkedInIcon} className="mt-4">
                                    Connect on LinkedIn
                                </SocialLink>
                                <SocialLink
                                    href="mailto:victor@victorvalentineromo.com"
                                    icon={MailIcon}
                                    className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
                                >
                                    victor@victorvalentineromo.com
                                </SocialLink>
                            </ul>
                        </div>
                    </div>
                </Container>
            </Layout>
        );
    }

    // Default page layout for other pages
    return (
        <Layout>
            <Head>
                <title>{title} - Victor Valentine Romo</title>
            </Head>
            <Container className="mt-16 sm:mt-32">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                        {title}
                    </h1>
                    {markdownContent && (
                        <div className="mt-6 prose dark:prose-invert">
                            <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
                        </div>
                    )}
                </div>
                {sections.map((section, index) => {
                    return <DynamicComponent key={index} {...section} />;
                })}
            </Container>
        </Layout>
    );
};
export default Component;
