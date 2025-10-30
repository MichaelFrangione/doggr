"use client";

import { Heading, Text, Button, Flex } from "@radix-ui/themes";
import LottieImage from "../../components/lottieImage";
import happyDogAnimation from "../../assets/cute_dog.json";
import styles from "../layout.module.css";

interface IntroViewProps {
    onStart: () => void;
}

export default function IntroView({ onStart }: IntroViewProps) {
    return (
        <>
            <Heading size="8" weight="bold" align="center" mb="9">
                We need to know a little about you!
            </Heading>
            <Flex gap="6" direction="column" align="center">
                <Text size="5" align="center" color="gray" style={{ maxWidth: '600px' }}>
                    Before we can find you your Furrever friend, we need to know a little about you.
                </Text>
                <div className={styles.dogAnimation}>
                    <LottieImage animationData={happyDogAnimation} loop={true} autoplay={true} />
                </div>
                <Button size="4" variant="solid" color="cyan" onClick={onStart}>
                    Let's Begin
                </Button>
            </Flex>
        </>
    );
}

