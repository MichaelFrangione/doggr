"use client";

import { useEffect, useState } from "react";
import { Heading, Text, Grid, TextField, Flex, Container, Link } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Breeds() {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await fetch('/api/breedFetcher');
                if (!response.ok) {
                    throw new Error('Failed to fetch breeds');
                }
                const data = await response.json();
                console.log('Fetched breeds:', data);
                setBreeds(data.breeds || []);
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        fetchBreeds();
    }, []);

    return (
        <Container>
            <Flex direction="column" gap="4" >
                <Heading size="8" mb="4">
                    Breeds
                </Heading>
                <div style={{ width: '500px', margin: '0 auto' }}>
                    <TextField.Root placeholder="Search for a breed..." value={search} onChange={(e) => setSearch(e.target.value)}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>
                <Grid columns="4" gap="5" mt="6" align="start">
                    {breeds.filter((breed) => breed.toLowerCase().includes(search.toLowerCase())).map((breed) => (
                        <Link href={`/breeds/${breed}`} key={breed} size="3">
                            {breed}
                        </Link>
                    ))}
                </Grid>
            </Flex>
        </Container>
    );
}