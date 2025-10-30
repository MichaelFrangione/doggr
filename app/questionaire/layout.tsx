"use client";

import { Container, Heading, Text } from "@radix-ui/themes";
import styles from "./layout.module.css";
import PeekingDog from "../components/PeekingDog/PeekingDog";
import Header from "../components/Header/Header";

export default function QuestionaireLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                <Container>{children}</Container>
                <PeekingDog />
            </main>
            <footer className={styles.footer}>
                <Container>
                    <Text size="2" color="gray">© 2025 Doggr. All rights reserved.</Text>
                </Container>
            </footer>
        </div>
    );
}

