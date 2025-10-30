import { Container, Text } from "@radix-ui/themes";
import Header from "../components/Header/Header";
import styles from "./layout.module.css";

export default function ChatLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <Container>
                    <Text size="2" color="gray">© 2025 Doggr. All rights reserved.</Text>
                </Container>
            </footer>
        </div>
    );
}