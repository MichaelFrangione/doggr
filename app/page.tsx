"use client";

import styles from "./page.module.css";
import { Button, Text, Heading, Container } from "@radix-ui/themes";
import LottieImage from "./components/lottieImage";
import happyDogAnimation from "./assets/happy_dog.json";
import Steps from "./components/Steps/Steps";
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
            How it works
          </Heading>
          <Steps />
          <Button
            size="4"
            variant="solid"
            color="cyan"
            onClick={() => router.push('/questionaire')}
          >
            Find your perfect match now
          </Button>
        </div>
      </main>
    </div>
  );
}
