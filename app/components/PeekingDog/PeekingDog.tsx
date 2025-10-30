"use client";

import LottieImage from "../lottieImage";
import sideDogAnimation from "../../assets/side_dog.json";
import styles from "./PeekingDog.module.css";
import { useState, useRef } from "react";

const PeekingDog = () => {
    const [animationClass, setAnimationClass] = useState<string>(styles.slideIn);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    const clearTimers = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMouseEnter = () => {
        clearTimers();
        // Immediately slide out
        setAnimationClass(styles.slideOut);
    };

    const handleMouseLeave = () => {
        clearTimers();

        // Wait 5 seconds then slide in
        timeoutRef.current = setTimeout(() => {
            setAnimationClass(styles.slideIn);
        }, 5000);
    };

    return (
        <div
            className={`${styles.doggo} ${animationClass}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <LottieImage animationData={sideDogAnimation} loop={true} autoplay={true} />
        </div>
    );
};

export default PeekingDog;