import { z } from "zod";
import { tool } from 'ai';
import { QuestionaireAnswer } from "@/app/actions";

// AI SDK tool for generating structured filter parameters from questionnaire answers
export const filterGeneratorTool = tool({
    description: `Generate structured filter parameters for dog breed search based on questionnaire answers. This tool analyzes user responses and produces precise numeric filters and semantic search terms that will be used to query a vector database of dog breeds.

FILTER PARAMETERS GUIDE:

WEIGHT (in kg):
- Extra small (0-10lbs): weightMaxKg = 4.5
- Small (11-25lbs): weightMinKg = 4.5, weightMaxKg = 11.5
- Medium (26-50lbs): weightMinKg = 11.5, weightMaxKg = 22
- Large (51-100lbs): weightMinKg = 22, weightMaxKg = 44
- Extra Large (101+ lbs): weightMinKg = 44, leave weightMaxKg undefined

ENERGY LEVEL (0-1 scale):
- Less than 30 min exercise: energyMaxValue = 0.4 (low energy required)
- 30-60 min exercise: energyMaxValue = 0.6 (moderate energy)
- 1-2 hours exercise: energyMinValue = 0.6 (needs active dog)
- 2+ hours exercise: energyMinValue = 0.8 (needs very energetic dog)

TRAINABILITY (0-1 scale):
- No experience: minTrainabilityValue = 0.6 (needs easier to train dog)
- Has experience: leave undefined (any trainability acceptable)

ALLERGIES:
- If allergies present: sheddingMaxValue = 0.4, groomingMaxValue = 0.4 (low shedding/grooming)

TEMPERAMENT TAGS:
- Extract relevant tags from personality question (e.g., "friendly", "protective", "calm", "independent")
- Use lowercase, space-separated values

SEARCH QUERY:
- Generate a rich semantic search query combining living situation, activity preferences, family needs
- Include natural language that describes the ideal dog characteristics
- Example: "apartment friendly small dog low energy gentle temperament good with children"

IMPORTANT:
- Be conservative with filters - prefer broader ranges to ensure results
- Only include filters when user explicitly indicates a preference
- Combine multiple aspects into searchQuery for better semantic matching`,

    inputSchema: z.object({
        questionsAndAnswers: z.array(z.object({
            question: z.object({
                id: z.string(),
                text: z.string()
            }),
            answer: z.object({
                id: z.string(),
                text: z.string()
            })
        })).describe("Array of question and answer pairs from the questionnaire")
    }),

    execute: async ({ questionsAndAnswers }: { questionsAndAnswers: QuestionaireAnswer[] }) => {
        console.log('=== FILTER GENERATOR TOOL CALLED ===');
        console.log('Questions count:', questionsAndAnswers.length);
        
        try {
            // Build filter parameters based on questionnaire answers
            const searchTerms: string[] = [];
            const temperamentTags: string[] = [];
            let energyMinValue: number | undefined;
            let energyMaxValue: number | undefined;
            let sheddingMaxValue: number | undefined;
            let groomingMaxValue: number | undefined;
            let weightMinKg: number | undefined;
            let weightMaxKg: number | undefined;
            let minTrainabilityValue: number | undefined;

            questionsAndAnswers.forEach(qa => {
                switch (qa.question.id) {
                    case "1": // Living situation
                        switch (qa.answer.id) {
                            case "0": // Apartment
                                searchTerms.push('apartment friendly indoor dog small space, condo apartment');
                                break;
                            case "1": // House with Yard
                                searchTerms.push('active outdoor dog house yard');
                                break;
                            case "2": // Rural Property
                                searchTerms.push('working farm dog rural property');
                                break;
                            case "3": // Busy Downtown Area
                                searchTerms.push('city, business district, urban, downtown, high traffic area');
                                break;
                        }
                        break;

                    case "2": // Size
                        switch (qa.answer.id) {
                            case "0": // Extra small (0-10lbs)
                                searchTerms.push('tiny toy breed under 4 kg');
                                weightMaxKg = 4.5;
                                break;
                            case "1": // Small (11-25lbs)
                                searchTerms.push('small dog 4-11 kg');
                                weightMinKg = 4.5;
                                weightMaxKg = 11.5;
                                break;
                            case "2": // Medium (26-50lbs)
                                searchTerms.push('medium sized dog 12-22 kg');
                                weightMinKg = 11.5;
                                weightMaxKg = 22;
                                break;
                            case "3": // Large (51-100lbs)
                                searchTerms.push('large dog 23-44 kg');
                                weightMinKg = 22;
                                weightMaxKg = 44;
                                break;
                            case "4": // Extra Large (101+ lbs)
                                searchTerms.push('extra large giant breed over 45 kg');
                                weightMinKg = 44;
                                break;
                        }
                        break;

                    case "3": // Trainability
                        switch (qa.answer.id) {
                            case "0": // has experience with training
                                break;
                            case "1": // has no experience with training
                                minTrainabilityValue = 0.6;
                                break;
                        }
                        break;

                    case "4": // Exercise
                        switch (qa.answer.id) {
                            case "0": // Less than 30 minutes
                                searchTerms.push('low energy, calm, couch potato, lazy, mellow, independent');
                                energyMaxValue = 0.4;
                                break;
                            case "1": // 30-60 minutes
                                searchTerms.push('regular exercise regular activity');
                                energyMaxValue = 0.6;
                                break;
                            case "2": // 1-2 hours
                                energyMinValue = 0.6;
                                break;
                            case "3": // 2+ hours
                                energyMinValue = 0.8;
                                break;
                        }
                        break;

                    case "5": // Children
                        if (qa.answer.id === "yes") {
                            searchTerms.push('family friendly good with children gentle temperament');
                        }
                        break;

                    case "6": // Pets
                        if (qa.answer.id === "yes") {
                            searchTerms.push('good with other dogs cats pets sociable');
                        }
                        break;

                    case "7": // Allergies
                        if (qa.answer.id === "yes") {
                            searchTerms.push('low shedding hypoallergenic minimal shedding, Occasional Bath/Brush');
                            sheddingMaxValue = 0.4;
                            groomingMaxValue = 0.4;
                        }
                        break;

                    case "8": // Personality
                        // Add personality traits to temperament tags
                        const personality = qa.answer.text.toLowerCase();
                        if (personality.includes('independent')) {
                            temperamentTags.push('independent');
                        }
                        if (personality.includes('lap dog')) {
                            temperamentTags.push('affectionate', 'devoted', 'loyal');
                        }
                        if (personality.includes('lazy')) {
                            temperamentTags.push('calm', 'gentle', 'mellow');
                        }
                        if (personality.includes('protective')) {
                            temperamentTags.push('alert', 'territorial', 'watchful');
                        }
                        break;
                }
            });

            // Create search query from collected terms
            const answersText = questionsAndAnswers.map(qa => `${qa.question.text}: ${qa.answer.text}`).join('\n');
            const searchQuery = searchTerms.join('. ') + '.\n\nOriginal answers:\n' + answersText;

            const result = {
                searchQuery,
                temperamentTags: [...new Set(temperamentTags)], // Remove duplicates
                energyMinValue,
                energyMaxValue,
                sheddingMaxValue,
                groomingMaxValue,
                weightMinKg,
                weightMaxKg,
                minTrainabilityValue
            };

            console.log('Generated filters:', result);
            console.log('=== FILTER GENERATOR TOOL END ===');
            
            return result;
        } catch (error) {
            console.error('Filter generator error:', error);
            throw new Error('Unable to generate filters at this time');
        }
    },
});


