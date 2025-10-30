// Type definitions for categorical columns
export type DogGroup =
    | 'Foundation Stock Service'
    | 'Herding Group'
    | 'Hound Group'
    | 'Miscellaneous Class'
    | 'Non-Sporting Group'
    | 'Sporting Group'
    | 'Terrier Group'
    | 'Toy Group'
    | 'Working Group';

export type GroomingFrequencyCategory =
    | '2-3 times a week brushing'
    | 'daily brushing'
    | 'occasional bath/brush'
    | 'specialty/professional'
    | 'weekly brushing';

export type SheddingCategory =
    | 'frequent'
    | 'infrequent'
    | 'occasional'
    | 'regularly'
    | 'seasonal';

export type EnergyLevelCategory =
    | 'calm'
    | 'couch potato'
    | 'energetic'
    | 'needs lots of activity'
    | 'regular exercise';

export type TrainabilityCategory =
    "agreeable" |
    "eager to please" |
    "easy training" |
    "independent" |
    "may be stubborn" |
    "trainability_category";

export type DemeanorCategory =
    "alert/responsive" |
    "aloof/wary" |
    "friendly" |
    "outgoing" |
    "reserved with strangers";

export type Temperment =
    "active" |
    "adaptable" |
    "adventurous" |
    "affectionate" |
    "agile" |
    "alert" |
    "alert and intelligent" |
    "amiable" |
    "amusing" |
    "aristocratic" |
    "athletic" |
    "attentive" |
    "boisterous" |
    "bold" |
    "bouncy" |
    "brave" |
    "bright" |
    "busy" |
    "calm" |
    "canny" |
    "charismatic" |
    "charming" |
    "cheerful" |
    "clever" |
    "comical" |
    "confident" |
    "confident guardian" |
    "courageous" |
    "courteous" |
    "curious" |
    "dashing" |
    "deeply affectionate" |
    "deeply devoted" |
    "dependable" |
    "determined" |
    "devoted" |
    "dignified" |
    "docile" |
    "eager" |
    "eager to please" |
    "easy-going" |
    "energetic" |
    "entertaining" |
    "enthusiastic" |
    "even-tempered" |
    "exuberant" |
    "faithful" |
    "family-oriented" |
    "famously funny" |
    "fearless" |
    "friendly" |
    "frollicking" |
    "fun-loving" |
    "funny" |
    "gentle" |
    "gentlemanly" |
    "good-humored" |
    "good-natured" |
    "good-tempered" |
    "graceful" |
    "gregarious" |
    "happy" |
    "happy-go-lucky" |
    "hardworking" |
    "home-loving" |
    "humble" |
    "independent" |
    "independent-minded" |
    "inquisitive" |
    "intelligent" |
    "keen" |
    "keenly alert" |
    "keenly observant" |
    "kind" |
    "lively" |
    "lovable" |
    "loving" |
    "low-key" |
    "loyal" |
    "majestic" |
    "mellow" |
    "merry" |
    "mischievous" |
    "noble" |
    "obedient" |
    "observant" |
    "optimistic" |
    "outgoing" |
    "patient" |
    "people-oriented" |
    "peppy" |
    "perceptive" |
    "perky" |
    "playful" |
    "playful but also work-oriented. very active and upbeat." |
    "pleasant" |
    "plucky" |
    "poised" |
    "polite" |
    "positive" |
    "powerful" |
    "profoundly loyal" |
    "proud" |
    "quick" |
    "ready to work" |
    "regal" |
    "regal in manner" |
    "regally dignified" |
    "reserved" |
    "reserved with strangers" |
    "responsive" |
    "sassy" |
    "self-confident" |
    "sense of humor" |
    "sensitive" |
    "serious-minded" |
    "smart" |
    "sociable" |
    "spirited" |
    "sprightly" |
    "spunky" |
    "strong" |
    "strong-willed" |
    "sweet" |
    "sweet-natured" |
    "sweet-tempered" |
    "tenacious" |
    "tenderhearted" |
    "tomboyish" |
    "trainable" |
    "undemanding" |
    "upbeat" |
    "versatile" |
    "very smart" |
    "vigilant" |
    "vivacious" |
    "watchful" |
    "wickedly smart" |
    "willing to please" |
    "work-oriented";

export type DogMetadata = {
    breed: string;
    description: string;
    temperament: Temperment[];
    popularity: number;
    minHeight: number;
    maxHeight: number;
    minWeight: number;
    maxWeight: number;
    minExpectancy: number;
    maxExpectancy: number;
    group: DogGroup;
    groomingFrequencyValue: number;
    groomingFrequencyCategory: GroomingFrequencyCategory;
    sheddingValue: number;
    sheddingCategory: SheddingCategory;
    energyLevelValue: number;
    energyLevelCategory: EnergyLevelCategory;
    trainabilityValue: number;
    trainabilityCategory: TrainabilityCategory;
    demeanorValue: number;
    demeanorCategory: DemeanorCategory;
};
