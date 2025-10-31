"use client";

import styles from "./page.module.css";
import { Button, Text, Heading, Container, Grid } from "@radix-ui/themes";
import LottieImage from "./components/lottieImage";
import happyDogAnimation from "./assets/happy_dog.json";
import checkedAnimation from "./assets/checked.json";
import cuteDogAnimation from "./assets/cute_dog.json";
import smilingDogAnimation from "./assets/smiling_dog.json";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.landing}>
          <Container size="3">
            <img src="/logo.png" alt="Doggr" className={styles.logo} />
            <Heading size="9" weight="bold" align="center" mb="6" mt="6">
              Welcome to Doggr
            </Heading>
            <Heading size="7" weight="medium" align="center" color="gray" mb="4">
              Find the perfect dog for you
            </Heading>
            <Text size="5" align="center" color="gray" style={{ maxWidth: '600px' }}>
              Doggr is a tool that helps you find the perfect dog for you. It uses a combination of AI and machine learning to help you find the perfect dog for you.
            </Text>
          </Container>
          <div className={styles.animationContainer}>
            <LottieImage animationData={happyDogAnimation} loop={true} autoplay={true} />
          </div>

        </div>
        <div className={styles.howToUse}>
          <Heading size="8" weight="bold" align="center" mb="7">
            Features
          </Heading>
          <Grid columns="3" gap="6" className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <LottieImage animationData={checkedAnimation} loop={true} autoplay={true} />
              </div>
              <Heading size="5" weight="bold" align="center" mb="3">
                Smart Questionnaire
              </Heading>
              <Text size="3" align="center" color="gray" mb="4">
                Answer a few questions about your lifestyle and preferences to get matched with your ideal breed using AI.
              </Text>
              <Button
                size="3"
                variant="solid"
                color="cyan"
                onClick={() => router.push('/questionaire')}
                className={styles.chatButton}
              >
                Take Questionnaire
              </Button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <LottieImage animationData={cuteDogAnimation} loop={true} autoplay={true} />
              </div>
              <Heading size="5" weight="bold" align="center" mb="3">
                Breed Browser
              </Heading>
              <Text size="3" align="center" color="gray" mb="4">
                Explore hundreds of dog breeds with detailed information, characteristics, and beautiful images.
              </Text>
              <Button
                size="3"
                variant="solid"
                color="cyan"
                onClick={() => router.push('/breeds')}
                className={styles.chatButton}
              >
                Browse Breeds
              </Button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <LottieImage animationData={smilingDogAnimation} loop={true} autoplay={true} />
              </div>
              <Heading size="5" weight="bold" align="center" mb="3">
                AI Chat Assistant
              </Heading>
              <Text size="3" align="center" color="gray" mb="4">
                Chat with Hiro, your personal AI assistant, to get answers about breeds, comparisons, and more.
              </Text>
              <Button
                size="3"
                variant="solid"
                color="cyan"
                onClick={() => router.push('/ask')}
                className={styles.chatButton}
              >
                Chat with Hiro
              </Button>
            </div>
          </Grid>
        </div>
      </main>
    </div>
  );
}
