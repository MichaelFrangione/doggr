import ReactMarkdown from 'react-markdown';
import { Box, Text } from '@radix-ui/themes';

interface MarkdownMessageProps {
    content: string;
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
    const extractText = (node: any): string => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join(' ');
        if (node && typeof node === 'object' && 'props' in node) return extractText(node.props.children);
        return '';
    };

    return (
        <ReactMarkdown
            components={{
                h2: ({ children }) => {
                    const breedNameText = extractText(children).replace(/\*\*/g, '').trim();
                    if (breedNameText) {
                        return (
                            <Box mb="3">
                                <a
                                    href={`/breeds/${encodeURIComponent(breedNameText)}`}
                                    style={{
                                        color: 'var(--cyan-11)',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        display: 'block',
                                    }}
                                >
                                    <Text size="5" weight="bold">{children}</Text>
                                </a>
                            </Box>
                        );
                    }
                    return (
                        <Box mb="3">
                            <Text size="5" weight="bold">{children}</Text>
                        </Box>
                    );
                },
                h3: ({ children }) => (
                    <Box mb="2">
                        <Text size="4" weight="bold">{children}</Text>
                    </Box>
                ),
                p: ({ children }) => <Text as="p" size="3" mb="2">{children}</Text>,
                ul: ({ children }) => <Box mb="2" style={{ paddingLeft: '1.5rem' }}>{children}</Box>,
                li: ({ children }) => (
                    <Box mb="1">
                        <Text size="3">{children}</Text>
                    </Box>
                ),
                strong: ({ children }) => <Text weight="bold">{children}</Text>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        style={{
                            color: 'var(--cyan-11)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

