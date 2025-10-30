import 'dotenv/config';

import { Index as UpstashIndex } from '@upstash/vector';
import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import path from 'node:path';
import type {
    DemeanorCategory,
    DogGroup,
    DogMetadata,
    EnergyLevelCategory,
    GroomingFrequencyCategory,
    SheddingCategory,
    Temperment,
    TrainabilityCategory
} from './types.js';

const index = new UpstashIndex();

const indexDogData = async () => {
    console.log('Reading dog data');
    const csvPath = path.join(process.cwd(), 'ai/rag/data/dog-data.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');

    const dogs = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
    }) as Record<string, string>[];

    console.log('Starting dog indexing');

    for (const dog of dogs) {

        const { breed, description, temperament, popularity, min_height, max_height, min_weight, max_weight, min_expectancy, max_expectancy, group, grooming_frequency_value, grooming_frequency_category, shedding_value, shedding_category, energy_level_value, energy_level_category, trainability_value, trainability_category, demeanor_value, demeanor_category } = dog as Record<string, string>;

        console.log(`Indexing dog`, dog);
        const text = `${breed}. ${description}`;

        try {
            const metadata: DogMetadata = {
                breed,
                description,
                temperament: temperament.split(',').map(t => t.trim().toLowerCase()) as Temperment[],
                popularity: Number(popularity),
                minHeight: Number(min_height),
                maxHeight: Number(max_height),
                minWeight: Number(min_weight),
                maxWeight: Number(max_weight),
                minExpectancy: Number(min_expectancy),
                maxExpectancy: Number(max_expectancy),
                group: group as DogGroup,
                groomingFrequencyValue: Number(grooming_frequency_value),
                groomingFrequencyCategory: grooming_frequency_category.toLowerCase() as GroomingFrequencyCategory,
                sheddingValue: Number(shedding_value),
                sheddingCategory: shedding_category.toLowerCase() as SheddingCategory,
                energyLevelValue: Number(energy_level_value),
                energyLevelCategory: energy_level_category.toLowerCase() as EnergyLevelCategory,
                trainabilityValue: Number(trainability_value),
                trainabilityCategory: trainability_category.toLowerCase() as TrainabilityCategory,
                demeanorValue: Number(demeanor_value),
                demeanorCategory: demeanor_category.toLowerCase() as DemeanorCategory,
            };

            await index.upsert({
                id: breed,
                data: text,
                metadata
            });

        } catch (error) {
            console.error(`Error indexing dog ${breed}`);
            console.error(error);
        }

    }
    console.log(`Success: All Dogs Indexed!`);
};

indexDogData();