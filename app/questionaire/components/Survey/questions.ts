type QuestionType = "multiple" | "boolean";

export interface AnswerOption {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: AnswerOption[];
}

export const QUESTIONS: Question[] = [
    {
        id: "1",
        type: "multiple",
        question: "What is your living situation?",
        options: [
            { id: "0", text: "Apartment" },
            { id: "1", text: "House with Yard" },
            { id: "2", text: "Rural Property" },
            { id: "3", text: "Busy Downtown Area" }
        ],
    },
    {
        id: "2",
        type: "multiple",
        question: "What size dog are you looking for?",
        options: [
            { id: "0", text: "Extra small (0-10lbs)" },
            { id: "1", text: "Small (11-25lbs)" },
            { id: "2", text: "Medium (26-50lbs)" },
            { id: "3", text: "Large (51-100lbs)" },
            { id: "4", text: "Extra Large (101+ lbs)" }
        ],
    },
    {
        id: "3",
        type: "boolean",
        question: "Do you have experience owning a dog?",
    },
    {
        id: "4",
        type: "multiple",
        question: "How much daily exercise can you provide?",
        options: [
            { id: "0", text: "Less than 30 minutes" },
            { id: "1", text: "30-60 minutes" },
            { id: "2", text: "1-2 hours" },
            { id: "3", text: "2+ hours" }
        ],
    },
    {
        id: "5",
        type: "boolean",
        question: "Do you have children under 12?",
    },
    {
        id: "6",
        type: "boolean",
        question: "Do you have any other pets?",
    },
    {
        id: "7",
        type: "boolean",
        question: "Do you have allergies to any animals?",
    },
    {
        id: "8",
        type: "multiple",
        question: "What would you describe your ideal dog's personality?",
        options: [
            { id: "0", text: "Independent" },
            { id: "1", text: "Lap dog" },
            { id: "2", text: "Lazy" },
            { id: "3", text: "Protective" },
        ],
    }
];