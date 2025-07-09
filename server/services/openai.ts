import OpenAI from "openai";

// Configure OpenRouter.ai
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENROUTER_API_KEY: string;
    }
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": "https://your-app.onrender.com",
    "X-Title": "My App",
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  }
});

// Test OpenAI connection
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is not configured");
      return false;
    }
    
    // Simple test with a minimal request
    await openai.models.list();
    console.log("OpenAI connection test successful");
    return true;
  } catch (error: any) {
    console.error("OpenAI connection test failed:", {
      message: error.message,
      status: error.status,
      type: error.type
    });
    return false;
  }
}

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
  generationTime: number;
}

export async function generateImage(prompt: string): Promise<GenerationResult> {
  const startTime = Date.now();
  
  // Validate API key exists
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured");
  }
  
  // Validate prompt
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("Prompt cannot be empty");
  }
  
  // Ensure prompt is within OpenAI's limits (4000 characters max)
  const cleanPrompt = prompt.trim();
  if (cleanPrompt.length > 4000) {
    throw new Error("Prompt is too long (max 4000 characters)");
  }
  
  try {
    console.log(`Generating image with prompt: "${cleanPrompt.substring(0, 100)}..."`);
    
    const response = await openai.images.generate({
      model: "openai/dall-e-3",
      response_format: "url",
      user: "your-user-id",  // Replace with your actual user ID
      prompt: cleanPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL returned from OpenRouter");
    }

    const generationTime = Math.floor((Date.now() - startTime) / 1000);
    
    console.log(`Image generated successfully in ${generationTime}s`);
    
    return {
      imageUrl: response.data[0].url,
      prompt: cleanPrompt,
      generationTime: generationTime,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
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

    if (!response?.data?.choices?.[0]?.message?.content) {
      throw new Error("Failed to generate prompt");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Prompt Generation Error:", error);
    return "Transform this person into a cute baby version while maintaining their key facial features and characteristics";
  }
}
