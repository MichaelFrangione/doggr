'use client';

import { Link, Container, Heading, Flex } from "@radix-ui/themes";
import styles from "./Header.module.css";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname === path;

    return (
        <header className={styles.header}>
            <Container>
                <Flex direction="row" gap="2" justify="between" align="center" wrap="wrap" className={styles.headerContent}>
                    <div className={styles.headerTitle} onClick={() => router.push('/')}>
                        <img src="/logo.png" alt="Doggr" />
                        <Heading size="6" weight="bold" align="left">
                            Doggr
                        </Heading>
                    </div>
                    <Flex direction="row" gap="4" className={styles.navLinks}>
                        <Link href="/questionaire" className={classNames(styles.headerLink, isActive('/questionaire') ? styles.active : '')}>
                            Questionaire
                        </Link>
                        <Link href="/breeds" className={classNames(styles.headerLink, isActive('/breeds') ? styles.active : '')}>
                            Breeds
                        </Link>
                        <Link href="/ask" className={classNames(styles.headerLink, isActive('/ask') ? styles.active : '')}>
                            Ask Doggr
                        </Link>
                    </Flex>
                </Flex>
            </Container>
        </header>
    );
}