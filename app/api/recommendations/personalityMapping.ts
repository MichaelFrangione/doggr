export const PERSONALITY_TRAITS = {
    independent: ['Reserved with Strangers', 'Independent', 'Aloof', 'Wary', 'Dignified', 'Clever', 'Confident'],
    lapDog: ['Friendly', 'Outgoing', 'Sweet', 'Playful', 'Sociable', 'Sweet-Tempered'],
    lazy: ['Couch Potato', 'Calm', 'Mellow', 'Good-natured'],
    protective: ['Alert/Responsive', 'Perky', 'Alert', 'Intelligent', 'Eager', 'Trainable', 'Strong', 'Devoted', 'Loyal']
};

export const PERSONALITY_OPTION_MAP: { [key: string]: keyof typeof PERSONALITY_TRAITS } = {
    '0': 'independent',
    '1': 'lapDog',
    '2': 'lazy',
    '3': 'protective'
};

/**
 * Checks if a breed's demeanor matches the given personality traits
 */
export function matchesPersonalityTraits(demeanorType: string, traits: string[]): boolean {
    const normalizedDemeanor = demeanorType.toLowerCase();
    return traits.some(trait => normalizedDemeanor.includes(trait.toLowerCase()));
}





