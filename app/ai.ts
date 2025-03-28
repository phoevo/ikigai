import Anthropic from "@anthropic-ai/sdk";
import Constants from 'expo-constants';


const { EXPO_PUBLIC_ANTHROPIC_API_KEY } = Constants.expoConfig?.extra || {};



const SYSTEM_PROMPT = `
You are giving advice to a close friend based on their mood and situation.
Your responses must always:
- Be short, warm, and supportive.
- Provide only **1-5 bullet points**.
- Use proper Markdown formatting.
`;

const SYSTEM_PROMPT2 = `
You are giving advice to a teacher who needs help with doing the best they can for their students.
List out the moods mentioned and give advice for each one.
Your responses must always:
- Be short, warm, and supportive.
- Create a subtitle for each mood mentioned.
- Provide acts of kindness, mindfulness meditation, and breathing exercises for each mood mentioned.
- Provide solutions instead of only advice.
- Within each mood's subtitle, have at least **4 bullet points**.
- Use proper Markdown formatting.
`;

const SYSTEM_PROMPT3 = `
You are giving advice to a coach who needs help with doing the best they can for their athletes.
List out the moods mentioned and give advice for each one.
Your responses must always:
- Be short, warm, and supportive.
- Create a subtitle for each mood mentioned.
- Provide acts of kindness, mindfulness meditation, and breathing exercises for each mood mentioned.
- Provide solutions instead of only advice.
- Within each mood's subtitle, have at least **4 bullet points**.
- Use proper Markdown formatting.
`;

export async function getAdviceFromClaude(
  userMood: string,
  userContext: string | null,
  userCompany: string | null,
  userSchoolRole: string | null,
  userTrainingRole: string | null
) {
  try {
    if (!EXPO_PUBLIC_ANTHROPIC_API_KEY) throw new Error("API key not found");

    const anthropic = new Anthropic({
      apiKey: EXPO_PUBLIC_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    let contextText = '';
    if (userContext) {
      if (userContext === 'school' && userSchoolRole) {
        contextText = `I am a ${userSchoolRole.replace('_', ' ')} at school.`;
      } else if (userContext === 'training' && userTrainingRole) {
        contextText = `I am a ${userTrainingRole.replace('_', ' ')} at training.`;
      } else {
        contextText = `I am at ${userContext.replace('_', ' ')}.`;
      }
    }

    const companyText = userCompany ? `I am ${userCompany.replace('_', ' ')}.` : '';
    const prompt = `${SYSTEM_PROMPT}\n\nHuman: I am feeling **${userMood}**. ${contextText} ${companyText}\n\nAssistant:`;

    const response = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 400,
      prompt: prompt,
    });

    return response.completion;
  } catch (error) {
    console.error("Error fetching advice:", error);
    return "Sorry, I couldn't generate advice. Please try again!";
  }
}

export async function getTeacherAdviceFromClaude(selectedMoods: string[] | null) {
  try {
    if (!selectedMoods || selectedMoods.length === 0) return "No moods selected.";
    const moodList = selectedMoods.map(mood => `- ${mood.replace(/([A-Z])/g, ' $1').trim()}`).join("\n");
    const prompt = `${SYSTEM_PROMPT2}\n\nHuman: Here are the moods students are feeling:\n${moodList}\n\nAssistant:`;

    if (!EXPO_PUBLIC_ANTHROPIC_API_KEY) throw new Error("API key not found");

    const anthropic = new Anthropic({ apiKey: EXPO_PUBLIC_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true });
    const response = await anthropic.completions.create({ model: "claude-2", max_tokens_to_sample: 400, prompt });
    return response.completion;
  } catch (error) {
    console.error("Error fetching advice for teachers:", error);
    return "Sorry, I couldn't generate advice. Please try again!";
  }
}

export async function getCoachAdviceFromClaude(selectedMoods: string[] | null) {
  try {
    if (!selectedMoods || selectedMoods.length === 0) return "No moods selected.";
    const moodList = selectedMoods.map(mood => `- ${mood.replace(/([A-Z])/g, ' $1').trim()}`).join("\n");
    const prompt = `${SYSTEM_PROMPT3}\n\nHuman: Here are the moods athletes are feeling:\n${moodList}\n\nAssistant:`;

    if (!EXPO_PUBLIC_ANTHROPIC_API_KEY) throw new Error("API key not found");

    const anthropic = new Anthropic({ apiKey: EXPO_PUBLIC_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true });
    const response = await anthropic.completions.create({ model: "claude-2", max_tokens_to_sample: 400, prompt });
    return response.completion;
  } catch (error) {
    console.error("Error fetching advice for coaches:", error);
    return "Sorry, I couldn't generate advice. Please try again!";
  }
}
