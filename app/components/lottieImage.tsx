import Lottie from 'lottie-react';
import styles from './lottieImage.module.css';

export default function LottieImage({ animationData, loop = true, autoplay = true }: { animationData: any; loop?: boolean; autoplay?: boolean; }) {
    return (
        <Lottie animationData={animationData} loop={loop} autoplay={autoplay} className={styles.animation} />
    );
}