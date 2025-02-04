import { HfInference } from '@huggingface/inference';
import { API_KEY } from '@env';

const SYSTEM_PROMPT = `
You are giving advice to a close friend based on their mood.
Your goal is to reinforce positive feelings when they are happy,
provide neutral guidance when they are neutral, and give supportive,
uplifting advice when they are sad.

The advice must be:
- Short, concise and easy to understand
- Warm tone with some bullet points of the next steps
- Formatted in markdown for readability

Examples:
- If the user is happy, encourage them to spread positivity.
- If the user is neutral, offer a simple reflection or suggestion.
- If the user is sad, give gentle, comforting advice.
`;


// const API_KEY='PASTE IN FROM ENV';


if (!API_KEY) {
    throw new Error("Hugging Face API key is missing. Please check your .env file.");
}

const hf = new HfInference(API_KEY);


// Define Mood type explicitly
type Mood = 'happy' | 'neutral' | 'sad';

export async function getAdviceFromMistral(userMood: Mood): Promise<string | undefined> {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I am feeling ${userMood}.
                What kind of steps should I take now?` }
,
            ],
            max_tokens: 1024,
        });

        return response.choices?.[0]?.message?.content;
    } catch (err) {
        console.error((err as Error).message);
        return undefined;
    }
}
