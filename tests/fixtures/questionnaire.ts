import type { QuestionaireAnswer } from "@/app/actions";

export const mockQuestionnaireAnswers: QuestionaireAnswer[] = [
    {
        question: {
            id: "1",
            text: "What is your living situation?"
        },
        answer: {
            id: "1",
            text: "House with Yard"
        }
    },
    {
        question: {
            id: "2",
            text: "What size dog are you looking for?"
        },
        answer: {
            id: "3",
            text: "Large (51-100lbs)"
        }
    },
    {
        question: {
            id: "3",
            text: "Do you have experience training dogs?"
        },
        answer: {
            id: "0",
            text: "Yes"
        }
    }
];



