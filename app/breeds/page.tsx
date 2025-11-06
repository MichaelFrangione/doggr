"use client";

import { useEffect, useState, useMemo } from "react";
import { Heading, Grid, TextField, Flex, Link, Container, Separator, Select, Checkbox } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import styles from "./page.module.css";
import useDebounce from "./hooks/use-debounce";


export default function Breeds() {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("alphabetical");
    const [orderBy, setOrderBy] = useState<string>("desc");

    const debouncedSearch = useDebounce(search, 300);

    const filterAlphabetical = () => {
        // Create a map to store the breeds by the first letter of the breed name and the breeds that start with that letter
        const alphabeticalMap = new Map<string, string[]>();

        // Filter the breeds by the debounced search
        const filtered = breeds.filter((breed) =>
            breed.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

        filtered.forEach((breed) => {
            // Create a breed object with the first letter of the breed name
            const firstLetter = breed[0].toUpperCase();

            // If the first letter is not in the map, add it to the map
            if (!alphabeticalMap.has(firstLetter)) {
                alphabeticalMap.set(firstLetter, [breed]);
            } else {
                // If the first letter is in the map, add the breed to the array
                const currentBreeds = alphabeticalMap.get(firstLetter) || [];
                alphabeticalMap.set(firstLetter, [...currentBreeds, breed]);
            }
        });

        // Return the map as an array of entries (letter, breeds)
        return Array.from(alphabeticalMap.entries());
    };


    const filteredBreeds = useMemo(() => {
        if (sortBy === "alphabetical") {
            return filterAlphabetical();
        }

        return breeds;
    }, [breeds, debouncedSearch]);


    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await fetch('/api/breedFetcher');
                if (!response.ok) {
                    throw new Error('Failed to fetch breeds');
                }
                const data = await response.json();
                console.log(data);
                setBreeds(data.breeds || []);
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        fetchBreeds();
    }, []);

    return (
        <Container className={styles.container}>
            <Flex direction="column" gap="4">
                <Heading size="8" mb="4">
                    Breeds
                </Heading>
                <div className={styles.searchContainer}>
                    <TextField.Root placeholder="Search for a breed..." value={search} onChange={(e) => setSearch(e.target.value)}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                    <SearchQuerySelectors sortBy={sortBy} setSortBy={setSortBy} orderBy={orderBy} setOrderBy={setOrderBy} />
                </div>
                {sortBy === "alphabetical" ?
                    filteredBreeds.map(([letter, breeds]) => (
                        <Flex direction="column" gap="2" my="4" key={letter}>
                            <Heading size="5" mb="2" color="gray">{letter}</Heading>
                            <Separator color="gray" style={{ width: '100px', margin: '0 auto' }} />
                            <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="5" mt="6" align="start" className={styles.breedsGrid}>
                                {breeds.map((breed: string) => (
                                    <Link href={`/breeds/${breed}`} key={breed} size="3" mb="2">
                                        {breed}
                                    </Link>
                                ))}
                            </Grid>
                        </Flex>
                    )) :
                    <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="5" mt="6" align="start" className={styles.breedsGrid}>
                        {breeds.map((breed) => (
                            <Link href={`/breeds/${breed}`} key={breed} size="3" mb="2">
                                {breed}
                            </Link>
                        ))}
                    </Grid>}
            </Flex>
        </Container>
    );
}

const SearchQuerySelectors = ({ sortBy, setSortBy, orderBy, setOrderBy }: { sortBy: string, setSortBy: (value: string) => void, orderBy: string, setOrderBy: (value: string) => void; }) => {


    return (
        <Flex direction="row" gap="2">
            <Select.Root defaultValue={sortBy} value={sortBy} onValueChange={setSortBy}>
                <Select.Trigger placeholder="Sort By" />
                <Select.Content>
                    <Select.Item value="alphabetical">Alphabetical</Select.Item>
                    <Select.Item value="popularity">Popularity</Select.Item>
                    <Select.Item value="weight">Weight</Select.Item>
                    <Select.Item value="height">Height</Select.Item>
                </Select.Content>
            </Select.Root>
            <Select.Root defaultValue={orderBy} value={orderBy} onValueChange={setOrderBy}>
                <Select.Trigger placeholder="Order By" />
                <Select.Content>
                    <Select.Item value="asc">Ascending</Select.Item>
                    <Select.Item value="desc">Descending</Select.Item>
                </Select.Content>
            </Select.Root>
        </Flex >
    );
};