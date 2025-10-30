"use client";

import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import LottieImage from "@/app/components/lottieImage";
import longDogAnimation from "@/app/assets/long_dog.json";
import { fetchDogImage } from "../utils/fetchDogImage";
import smileDogAnimation from "@/app/assets/smiling_dog.json";

interface DogImageProps {
    breed: string;
    className?: string;
}

export default function DogImage({ breed, className }: DogImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            setLoading(true);
            setImageUrl(null);

            const result = await fetchDogImage(breed);
            console.log('Result:', result);


            if (!result.success) {
                setLoading(false);
                setError(result.error);
                return;
            }

            setImageUrl(result.url);
            setLoading(false);
        };

        loadImage();
    }, [breed]);

    if (error) {
        return (
            <div className={className}>
                <Flex direction="column" align="center" justify="center">
                    <div style={{ width: '200px', height: '100%' }}>
                        <LottieImage animationData={smileDogAnimation} />
                    </div>
                    <Text size="2" color="gray">Sorry, I can't find an image for this breed</Text>
                </Flex >
            </div >
        );
    }

    if (loading || !imageUrl) {
        return (
            <div className={className}>
                <Flex direction="column" align="center" justify="center">
                    <div style={{ width: '350px', height: '100%', marginBottom: '-40px', marginTop: '-100px' }}>
                        <LottieImage animationData={longDogAnimation} />
                    </div>
                    <Text size="2" color="gray">Fetching breed image...</Text>
                </Flex>
            </div >
        );
    }

    return (
        <div className={className}>
            <Image
                src={imageUrl}
                alt={`${breed} image`}
                width={350}
                height={350}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                }}
                unoptimized
            />
        </div>
    );
}

