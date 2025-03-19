import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `
You are giving advice to a close friend based on their mood and situation.
Your responses must always:
- Be short, warm, and supportive.
- Provide only **1-5 bullet points**.
- Use proper Markdown formatting.
`;

const anthropic = new Anthropic({
  apiKey: "env",
  dangerouslyAllowBrowser: true, // Required for Expo
});

// ✅ Updated function to accept context, company, and schoolRole parameters
export async function getAdviceFromClaude(
  userMood: string,
  userContext: string | null,
  userCompany: string | null,
  userSchoolRole: string | null // New parameter for student/teacher role
) {
  try {
    // Build context text based on the selected context (work, home, school, outside)
    let contextText = '';
    if (userContext) {
      if (userContext === 'school' && userSchoolRole) {
        // If context is school, use the school role (student/teacher)
        contextText = `I am a ${userSchoolRole.replace('_', ' ')} at school.`;
      } else {
        contextText = `I am at ${userContext.replace('_', ' ')}.`;
      }
    }

    // Build company text based on whether the user is alone or with people
    const companyText = userCompany ? `I am ${userCompany.replace('_', ' ')}.` : '';

    // Create the prompt with all the context and mood details
    const prompt = `${SYSTEM_PROMPT}\n\nHuman: I am feeling **${userMood}**. ${contextText} ${companyText}\n\nAssistant:`;

    const response = await anthropic.completions.create({
      model: "claude-2", // Can change to "claude-3" if needed
      max_tokens_to_sample: 400,
      prompt: prompt,
    });

    return response.completion;
  } catch (error) {
    console.error("Error fetching advice:", error);
    return "Sorry, I couldn't generate advice. Please try again!";
  }
}
