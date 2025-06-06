import { HoverCard, LetterPullUp, NumberCounter } from '@/components/react-bits';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';
import classNames from 'classnames';
import Section from '../Section';

interface Metric {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
}

interface MetricsSection {
    type: 'MetricsSection';
    elementId?: string;
    colors?: 'colors-a' | 'colors-b' | 'colors-c' | 'colors-d' | 'colors-e' | 'colors-f';
    backgroundSize?: 'full' | 'inset';
    title?: string;
    subtitle?: string;
    metrics: Metric[];
    styles?: {
        self?: {
            [key: string]: any;
        };
    };
}

export default function Component(props: MetricsSection) {
    const { elementId, colors, backgroundSize, title, subtitle, metrics = [], styles = {} } = props;
    const sectionAlign = styles.self?.textAlign ?? 'center';
    
    return (
        <Section elementId={elementId} colors={colors} backgroundSize={backgroundSize} styles={styles.self}>
            <div className={classNames('w-full', mapStyles({ textAlign: sectionAlign }))}>
                {title && (
                    <LetterPullUp 
                        text={title}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                    />
                )}
                {subtitle && (
                    <p className={classNames('text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto', { 'mt-4': title })}>
                        {subtitle}
                    </p>
                )}
                
                <div className={classNames('grid gap-8 mt-12', {
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': metrics.length === 4,
                    'grid-cols-1 md:grid-cols-3': metrics.length === 3,
                    'grid-cols-1 md:grid-cols-2': metrics.length === 2,
                    'grid-cols-1': metrics.length === 1,
                })}>
                    {metrics.map((metric, index) => (
                        <HoverCard key={index} className="text-center p-6">
                            <NumberCounter
                                to={metric.value}
                                suffix={metric.suffix}
                                prefix={metric.prefix}
                                label={metric.label}
                                className="mb-4"
                            />
                            {metric.description && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {metric.description}
                                </p>
                            )}
                        </HoverCard>
                    ))}
                </div>
            </div>
        </Section>
    );
} 