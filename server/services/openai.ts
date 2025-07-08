import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
  generationTime: number;
}

export async function generateImage(prompt: string): Promise<GenerationResult> {
  const startTime = Date.now();
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const generationTime = Math.floor((Date.now() - startTime) / 1000);
    
    if (!response.data[0]?.url) {
      throw new Error("No image URL returned from OpenAI");
    }

    return {
      imageUrl: response.data[0].url,
      prompt: prompt,
      generationTime: generationTime,
    };
  } catch (error) {
    console.error("OpenAI Image Generation Error:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateBabyTransformPrompt(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating image generation prompts. Create a detailed prompt to transform a person into a baby version while maintaining their key features and characteristics. Focus on making the face more round, eyes bigger, features softer, but keep the essence of the original person."
        },
        {
          role: "user",
          content: `Create a baby transformation prompt for: ${description}`
        }
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content || "Transform this person into a cute baby version while maintaining their key facial features and characteristics";
  } catch (error) {
    console.error("OpenAI Prompt Generation Error:", error);
    return "Transform this person into a cute baby version while maintaining their key facial features and characteristics";
  }
}
