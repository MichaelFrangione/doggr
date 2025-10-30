"use client";

import dogWalkingAnimation from '../assets/cute_dog.json';
import styles from './loading.module.css';
import LottieImage from './lottieImage';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.animation}>
                <LottieImage animationData={dogWalkingAnimation} loop={true} autoplay={true} />
            </div>
            <p className={styles.text}>Fetching...</p>
        </div>
    );
}