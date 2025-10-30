
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Container, Button, Flex, Box, Text, TextField } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import LottieImage from '../components/lottieImage';
import smileDogAnimation from '../assets/smiling_dog.json';
import MarkdownMessage from './components/MarkdownMessage';
import styles from './page.module.css';

const initialMessage = "Woof! I'm Hiro and I'm your personal Doggr assistant. I can help answer questions about dog breeds, make comparisons, and answer any dog related questions you have.";

export default function AskPage() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });

    const [input, setInput] = useState('');

    const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
        if (e) e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        setInput('');
        await sendMessage({ text: trimmed });
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Submit on Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleSubmit(e);
        }
    };

    const isLoading = status === 'submitted' || status === 'streaming';

    // Auto-scroll on new messages
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <Container size="3" className={styles.container}>
            <div className={styles.chatBox} ref={scrollRef}>
                <Flex direction="column" gap="3">
                    <Flex direction="column" gap="1" align="start">
                        <Text size="1" color="gray" weight="medium">
                            Hiro
                        </Text>
                        <AiMessage parts={[initialMessage]} />
                    </Flex>

                    {messages.map((message, index) => {
                        const isUser = message.role === 'user';
                        return (
                            <Flex key={index} direction="column" gap="1" align={isUser ? 'end' : 'start'}>
                                <Text size="1" color="gray" weight="medium">
                                    {isUser ? 'You' : 'Hiro'}
                                </Text>
                                {isUser ? (
                                    <Box className={styles.userBubble}>
                                        {message.parts.map((part, partIndex) => {
                                            if ('text' in part) {
                                                return (
                                                    <Text as="p" key={partIndex} size="3">
                                                        {part.text}
                                                    </Text>
                                                );
                                            }
                                            return null;
                                        })}
                                    </Box>
                                ) : (
                                    <AiMessage
                                        parts={message.parts.map(part => 'text' in part ? part.text : null)}
                                    />
                                )}
                            </Flex>
                        );
                    })}
                    {isLoading && (
                        <Flex direction="column" gap="1" align="start">
                            <Text color="gray">Fetching...</Text>

                        </Flex>
                    )}
                </Flex>
            </div>

            <form onSubmit={handleSubmit}>
                <Flex align="center" gap="2">
                    <TextField.Root
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        className={styles.textField}
                        autoFocus
                    />
                    <Button color='cyan' type="submit" disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                </Flex>
            </form>
        </Container>
    );
}

const AiMessage = ({ parts }: { parts: (string | null)[]; }) => {
    return (
        <Flex direction="column" gap="1" align="start">
            <Flex align="start" gap="2">
                <Box className={styles.assistantAvatar}>
                    <LottieImage animationData={smileDogAnimation} />
                </Box>

                <Box className={styles.assistantBubble}>
                    {parts.map((part, partIndex) => {
                        if (part) {
                            return <MarkdownMessage key={partIndex} content={part} />;
                        }
                        return null;
                    })}
                </Box>
            </Flex>
        </Flex>
    );
};