import { Text } from "@radix-ui/themes";
import styles from "./Steps.module.css";

const Steps = () => (
    <div className={styles.steps}>
        <div className={styles.stepCard}>
            <div className={styles.stepIcon}>1</div>
            <Text size="3" weight="bold" align="center" mb="2">Answer Questions</Text>
            <Text size="2" align="center" color="gray">Tell us about your lifestyle and preferences</Text>
        </div>

        <div className={styles.stepCard}>
            <div className={styles.stepIcon}>2</div>
            <Text size="3" weight="bold" align="center" mb="2">AI Analysis</Text>
            <Text size="2" align="center" color="gray">Our AI analyzes hundreds of breeds</Text>
        </div>

        <div className={styles.stepCard}>
            <div className={styles.stepIcon}>3</div>
            <Text size="3" weight="bold" align="center" mb="2">Perfect Match</Text>
            <Text size="2" align="center" color="gray">Get matched with your ideal breed</Text>
        </div>
    </div>
);

export default Steps;