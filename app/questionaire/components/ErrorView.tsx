"use client";

import { Heading, Text, Button, Flex } from "@radix-ui/themes";

interface ErrorViewProps {
    error: string | null;
    onReset: () => void;
    onGoBack?: () => void;
    showGoBack?: boolean;
}

export default function ErrorView({ error, onReset, onGoBack, showGoBack }: ErrorViewProps) {
    return (
        <>
            <Heading size="8" mb="6">
                Oops, something went wrong!
            </Heading>
            <Text size="5" color="gray" mb="6">
                {error || 'An error occurred'}
            </Text>
            <Flex gap="4" direction="column" align="center">
                <Button size="4" variant="solid" color="cyan" onClick={onReset}>
                    Start Over
                </Button>
                {showGoBack && onGoBack && (
                    <Button size="3" variant="outline" color="gray" onClick={onGoBack}>
                        Go Back to Questionnaire
                    </Button>
                )}
            </Flex>
        </>
    );
}

