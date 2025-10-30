"use client";

import Loading from "@/app/components/loading";
import BreedDisplay from "@/app/components/BreedDisplay/BreedDisplay";
import type { DogRecommendation } from "@/app/components/BreedDisplay/types";
import { Button, Container, Heading, Text, Flex } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BreedDetail() {
    const { breed } = useParams();
    const breedName = decodeURIComponent(breed as string);
    const [breedData, setBreedData] = useState<DogRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBreedData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/breed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ breedName }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch breed');
                }

                const data = await response.json();
                console.log('Breed data:', data);
                setBreedData(data.breed);
            } catch (err) {
                console.error('Error fetching breed:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchBreedData();
    }, [breedName]);

    const wrapper = (children: React.ReactNode) => (
        <Container>
            <Flex mb="4" justify="start">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/breeds')}
                >
                    ← Back to Breeds
                </Button>
            </Flex>
            {children}
        </Container>
    );


    if (loading) {
        return (
            wrapper(<Loading />)
        );
    }

    if (error) {
        return (
            wrapper(<Text color="red">Error: {error}</Text>
            )
        );
    }

    if (!breedData) {
        return (
            wrapper(<Text>No data available</Text>)
        );
    }

    return wrapper(<BreedDisplay breed={breedData} />);
}

