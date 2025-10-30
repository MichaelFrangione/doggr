export type FilterInputs = {
    temperamentTags?: string[];
    energyMinValue?: number;
    energyMaxValue?: number;
    sheddingMaxValue?: number;
    groomingMaxValue?: number;
    weightMinKg?: number;
    weightMaxKg?: number;
    minTrainabilityValue?: number;
    popularityMaxRank?: number;
};

const buildMetadataFilter = ({
    temperamentTags,
    energyMinValue,
    energyMaxValue,
    sheddingMaxValue,
    groomingMaxValue,
    weightMinKg,
    weightMaxKg,
    minTrainabilityValue,
    popularityMaxRank
}: FilterInputs): string | undefined => {
    const groups: string[] = [];

    if (temperamentTags && temperamentTags.length) {
        const clause = temperamentTags.map(t => `temperament CONTAINS "${t}"`).join(' OR ');
        groups.push(`(${clause})`);
    }

    if (typeof energyMinValue === 'number' || typeof energyMaxValue === 'number') {
        const clauses: string[] = [];
        if (typeof energyMinValue === 'number') clauses.push(`energyLevelValue >= ${energyMinValue}`);
        if (typeof energyMaxValue === 'number') clauses.push(`energyLevelValue <= ${energyMaxValue}`);
        if (clauses.length) groups.push(`(${clauses.join(' AND ')})`);
    }

    if (typeof sheddingMaxValue === 'number') {
        groups.push(`(sheddingValue <= ${sheddingMaxValue})`);
    }

    if (typeof groomingMaxValue === 'number') {
        groups.push(`(groomingFrequencyValue <= ${groomingMaxValue})`);
    }

    if (typeof weightMinKg === 'number' || typeof weightMaxKg === 'number') {
        const clauses: string[] = [];
        if (typeof weightMinKg === 'number') clauses.push(`minWeight >= ${weightMinKg}`);
        if (typeof weightMaxKg === 'number') clauses.push(`maxWeight <= ${weightMaxKg}`);
        if (clauses.length) groups.push(`(${clauses.join(' AND ')})`);
    }

    if (typeof minTrainabilityValue === 'number') {
        groups.push(`(trainabilityValue >= ${minTrainabilityValue})`);
    }

    if (typeof popularityMaxRank === 'number') {
        // Treat missing/zero popularity as not popular: require popularity >= 1
        groups.push(`(popularity >= 1 AND popularity <= ${popularityMaxRank})`);
    }

    return groups.length ? groups.join(' AND ') : undefined;
};


// Build progressively relaxed filters
export const buildFilterTiers = (inputs: FilterInputs): string[] => {
    const tiers: string[] = [];

    // Tier 1: All filters
    const fullFilter = buildMetadataFilter(inputs);
    if (fullFilter) {
        tiers.push(fullFilter);
    }

    // Tier 2: Skip temperament tags (they can be too restrictive)
    if (inputs.temperamentTags) {
        const filterWithoutTemperament = buildMetadataFilter({
            ...inputs,
            temperamentTags: undefined
        });
        if (filterWithoutTemperament) {
            tiers.push(filterWithoutTemperament);
        }
    }

    // Tier 3: Only numeric filters (energy, shedding, grooming)
    const numericFilter = buildMetadataFilter({
        temperamentTags: undefined,
        energyMinValue: inputs.energyMinValue,
        energyMaxValue: inputs.energyMaxValue,
        sheddingMaxValue: inputs.sheddingMaxValue,
        groomingMaxValue: inputs.groomingMaxValue,
        weightMinKg: inputs.weightMinKg,
        weightMaxKg: inputs.weightMaxKg,
        minTrainabilityValue: inputs.minTrainabilityValue,
        popularityMaxRank: inputs.popularityMaxRank
    });
    if (numericFilter) {
        tiers.push(numericFilter);
    }

    // Tier 4: Only essential filters (weight, trainability)
    const essentialFilter = buildMetadataFilter({
        temperamentTags: undefined,
        energyMinValue: undefined,
        energyMaxValue: undefined,
        sheddingMaxValue: undefined,
        groomingMaxValue: undefined,
        weightMinKg: inputs.weightMinKg,
        weightMaxKg: inputs.weightMaxKg,
        minTrainabilityValue: inputs.minTrainabilityValue,
        popularityMaxRank: inputs.popularityMaxRank
    });
    if (essentialFilter) {
        tiers.push(essentialFilter);
    }

    // Tier 5: No filter (just semantic search)
    tiers.push('');

    return tiers;
};

export function buildPopularityCaps(): Array<number | undefined> {
    return [50, 100, 150, undefined];
}

// Matched attribute types are kept inline to avoid cross-import from app code
export type MatchedAttribute = {
    category: string;
    label: string;
    breedValue: string;
    userValue: string;
    matched: boolean;
};

// Minimal DogMetadata shape used here (duplicated to avoid tight coupling)
type MinimalDogMetadata = {
    temperament: string[] | string;
    energyLevelValue?: number;
    energyLevelCategory?: string;
    trainabilityValue?: number;
    trainabilityCategory?: string;
    minWeight: number;
    maxWeight: number;
    sheddingValue?: number;
    sheddingCategory?: string;
    groomingFrequencyValue?: number;
    groomingFrequencyCategory?: string;
};

type MinimalBreedData = {
    energy?: { level?: string; value?: number; };
    trainability?: { level?: string; value?: number; };
};

export function buildMatchedAttributes(
    filterInputs: FilterInputs & {
        temperamentTags?: string[];
        energyMinValue?: number;
        energyMaxValue?: number;
        sheddingMaxValue?: number;
        groomingMaxValue?: number;
        weightMinKg?: number;
        weightMaxKg?: number;
        minTrainabilityValue?: number;
    },
    metadata: MinimalDogMetadata,
    breedData: MinimalBreedData
): MatchedAttribute[] {
    const attrs: MatchedAttribute[] = [];

    // Temperament overlap
    if (Array.isArray(filterInputs.temperamentTags) && filterInputs.temperamentTags.length > 0) {
        const userTags = filterInputs.temperamentTags.map((t) => t.toLowerCase());
        const breedTemps = (Array.isArray(metadata.temperament) ? metadata.temperament : String(metadata.temperament || '').split(','))
            .map((t) => String(t).trim().toLowerCase())
            .filter(Boolean);
        const overlap = userTags.filter((t) => breedTemps.includes(t));
        attrs.push({
            category: 'Temperament',
            label: 'Temperament match',
            breedValue: Array.isArray(metadata.temperament) ? metadata.temperament.join(', ') : String(metadata.temperament || ''),
            userValue: userTags.join(', '),
            matched: overlap.length > 0,
        });
    }

    // Energy range
    if (typeof filterInputs.energyMinValue === 'number' || typeof filterInputs.energyMaxValue === 'number') {
        const minV = typeof filterInputs.energyMinValue === 'number' ? filterInputs.energyMinValue : undefined;
        const maxV = typeof filterInputs.energyMaxValue === 'number' ? filterInputs.energyMaxValue : undefined;
        const val = metadata.energyLevelValue ?? breedData.energy?.value;
        const meetsMin = typeof minV === 'number' ? (val ?? -Infinity) >= minV : true;
        const meetsMax = typeof maxV === 'number' ? (val ?? Infinity) <= maxV : true;
        attrs.push({
            category: 'Energy',
            label: 'Energy preference',
            breedValue: `${breedData.energy?.level || metadata.energyLevelCategory || 'N/A'}`,
            userValue: `${minV !== undefined ? `≥ ${minV}` : ''}${minV !== undefined && maxV !== undefined ? ' and ' : ''}${maxV !== undefined ? `≤ ${maxV}` : ''}` || 'Any',
            matched: meetsMin && meetsMax,
        });
    }

    // Trainability minimum
    if (typeof filterInputs.minTrainabilityValue === 'number') {
        const minTrain = filterInputs.minTrainabilityValue;
        const val = metadata.trainabilityValue ?? breedData.trainability?.value;
        attrs.push({
            category: 'Trainability',
            label: 'Trainability',
            breedValue: `${breedData.trainability?.level || metadata.trainabilityCategory || 'N/A'}`,
            userValue: `≥ ${minTrain}`,
            matched: typeof val === 'number' ? val >= minTrain : false,
        });
    }

    // Weight range
    if (typeof filterInputs.weightMinKg === 'number' || typeof filterInputs.weightMaxKg === 'number') {
        const minW = typeof filterInputs.weightMinKg === 'number' ? filterInputs.weightMinKg : undefined;
        const maxW = typeof filterInputs.weightMaxKg === 'number' ? filterInputs.weightMaxKg : undefined;
        const breedMinKg = metadata.minWeight;
        const breedMaxKg = metadata.maxWeight;
        const meetsMin = typeof minW === 'number' ? breedMinKg >= minW : true;
        const meetsMax = typeof maxW === 'number' ? breedMaxKg <= maxW : true;

        const kgToLbs = (kg: number | undefined) =>
            typeof kg === 'number' ? Math.round(kg * 2.20462) : undefined;

        const breedMinLbs = kgToLbs(breedMinKg);
        const breedMaxLbs = kgToLbs(breedMaxKg);
        const minWLbs = kgToLbs(minW);
        const maxWLbs = kgToLbs(maxW);

        attrs.push({
            category: 'Size',
            label: 'Weight preference',
            breedValue: `${breedMinLbs ?? 'N/A'}-${breedMaxLbs ?? 'N/A'} lbs`,
            userValue:
                `${minWLbs !== undefined ? `≥ ${minWLbs} lbs` : ''}` +
                `${minWLbs !== undefined && maxWLbs !== undefined ? ' and ' : ''}` +
                `${maxWLbs !== undefined ? `≤ ${maxWLbs} lbs` : ''}` || 'Any',
            matched: meetsMin && meetsMax,
        });
    }

    // Shedding (allergies)
    if (typeof filterInputs.sheddingMaxValue === 'number') {
        const maxShed = filterInputs.sheddingMaxValue;
        const val = metadata.sheddingValue;
        attrs.push({
            category: 'Allergies',
            label: 'Shedding',
            breedValue: `${metadata.sheddingCategory ?? 'N/A'}`,
            userValue: `≤ ${maxShed}`,
            matched: typeof val === 'number' ? val <= maxShed : false,
        });
    }

    // Grooming (maintenance burden)
    if (typeof filterInputs.groomingMaxValue === 'number') {
        const maxGroom = filterInputs.groomingMaxValue;
        const val = metadata.groomingFrequencyValue;
        attrs.push({
            category: 'Grooming',
            label: 'Grooming',
            breedValue: `${metadata.groomingFrequencyCategory ?? 'N/A'}`,
            userValue: `≤ ${maxGroom}`,
            matched: typeof val === 'number' ? val <= maxGroom : false,
        });
    }

    return attrs;
}