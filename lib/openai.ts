import OpenAI from 'openai';
import { RepurposeOutputs } from '@/types';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateRepurposedContent(
  content: string,
  title: string,
  brandVoice?: string | null
): Promise<RepurposeOutputs> {
  const openai = getOpenAIClient();
  
  const prompt = `You are a content repurposing expert. Given a blog post, create platform-specific versions that maintain the core message but adapt tone, length, and format for each platform.

BLOG TITLE: ${title}

BLOG CONTENT:
${content.slice(0, 8000)}

USER'S BRAND VOICE:
${brandVoice || "Professional but approachable, conversational, avoids jargon"}

Generate the following:

1. TWITTER THREAD (5-7 tweets)
- Start with a hook that creates curiosity
- Each tweet should stand alone but flow together
- End with a CTA or thought-provoking question
- Include relevant emojis sparingly
- No hashtags in thread (except maybe last tweet)

2. LINKEDIN POST (200-300 words)
- Professional but not stuffy
- Include line breaks for readability
- Start with a hook, end with engagement question
- Storytelling format works well

3. INSTAGRAM CAPTION (100-150 words)
- Conversational, emoji-friendly
- Include 5-10 relevant hashtags at the end
- End with a question to drive comments
- Consider carousel/swipe teaser if applicable

4. TIKTOK SCRIPT (30-60 seconds when spoken)
- Start with attention-grabbing hook (first 3 seconds critical)
- Bullet points for talking points
- Conversational, as if talking to a friend
- End with CTA (follow, comment, share)

5. NEWSLETTER BLURB (80-120 words)
- Email-friendly tone (like writing to a friend)
- Brief summary + key insight
- Tease the full post with a link

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "twitter_thread": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"],
  "linkedin_post": "full linkedin post here",
  "instagram_caption": "full caption with hashtags",
  "tiktok_script": "full script here",
  "newsletter_blurb": "full blurb here"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a content repurposing expert. Always respond with valid JSON only, no markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const responseText = response.choices[0]?.message?.content || '';
  
  // Clean up response - remove markdown code blocks if present
  let cleanedResponse = responseText.trim();
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.slice(7);
  }
  if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.slice(3);
  }
  if (cleanedResponse.endsWith('```')) {
    cleanedResponse = cleanedResponse.slice(0, -3);
  }
  
  try {
    const outputs = JSON.parse(cleanedResponse.trim()) as RepurposeOutputs;
    return outputs;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', cleanedResponse);
    throw new Error('Failed to parse AI response');
  }
}
