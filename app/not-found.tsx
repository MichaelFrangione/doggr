"use client";

import { Heading, Text, Button, Container, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header/Header";
import LottieImage from "@/app/components/lottieImage";
import angryDogAnimation from "@/app/assets/angry_dog.json";
import styles from "./not-found.module.css";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Container size="3" className={styles.content}>
                <Flex direction="column" align="center" gap="6">
                    <div className={styles.animation}>
                        <LottieImage animationData={angryDogAnimation} />
                    </div>
                    <Heading size="9" weight="bold" align="center">
                        404
                    </Heading>
                    <Heading size="6" weight="medium" align="center" color="gray">
                        Page Not Found
                    </Heading>
                    <Text size="4" align="center" color="gray" style={{ maxWidth: '500px' }}>
                        Oops! The page you're looking for seems to have wandered off.
                        Don't worry, let's get you back to finding your perfect pup!
                    </Text>
                    <Flex gap="3">
                        <Button
                            size="4"
                            variant="solid"
                            color="cyan"
                            onClick={() => router.push('/')}
                        >
                            Go Home
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </div>
    );
}
