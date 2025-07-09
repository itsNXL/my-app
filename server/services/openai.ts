import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

// Test OpenAI connection
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
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
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
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
      model: "dall-e-3",
      prompt: cleanPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url"
    });

    const generationTime = Math.floor((Date.now() - startTime) / 1000);
    
    if (!response.data[0]?.url) {
      throw new Error("No image URL returned from OpenAI");
    }

    console.log(`Image generated successfully in ${generationTime}s`);
    
    return {
      imageUrl: response.data[0].url,
      prompt: cleanPrompt,
      generationTime: generationTime,
    };
  } catch (error: any) {
    console.error("OpenAI Image Generation Error:", {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code,
      param: error.param
    });
    
    // Provide more specific error messages
    if (error.status === 400) {
      if (error.type === 'image_generation_user_error') {
        throw new Error("The prompt contains content that violates OpenAI's usage policies. Please try a different prompt.");
      }
      throw new Error(`Invalid request: ${error.message || 'Please check your prompt and try again'}`);
    } else if (error.status === 401) {
      throw new Error("Invalid OpenAI API key");
    } else if (error.status === 429) {
      throw new Error("API rate limit exceeded. Please try again later.");
    } else if (error.status === 500) {
      throw new Error("OpenAI service is temporarily unavailable");
    }
    
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
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
