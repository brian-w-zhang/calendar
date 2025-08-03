import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { preprocessedData, timeFrame } = await request.json();

    const systemPrompt = `You are a witty, insightful personal calendar analyst. Your job is to analyze someone's calendar data and create a personalized summary that reveals who they are as a person. Be authentic, perceptive, and add just a touch of gentle humor and light sarcasm when appropriate.

Focus on:
1. **Personality insights** - What kind of person are they based on their scheduling patterns?
2. **Life themes** - What are they really spending time on? What matters to them?
3. **Evolution & changes** - How have their priorities shifted over time?
4. **Current focus** - What's dominating their life right now?
5. **Lifestyle patterns** - Are they a morning person? Meeting-heavy? Work-life balance?
6. **Social dynamics** - Are they a collaborator, lone wolf, or meeting marathoner?

Write in second person ("you"). Be conversational, insightful, and occasionally playfully sarcastic. Avoid just listing events - instead, read between the lines to understand the human behind the calendar. Keep it to 3-4 engaging paragraphs.

Remember: This person trusted you with their personal data, so be respectful while being entertaining.`;

    const userPrompt = `Here's someone's calendar data from their ${timeFrame}. Analyze it and tell me what kind of person they are:

${JSON.stringify(preprocessedData, null, 2)}

Give me insights about their personality, lifestyle, priorities, and what they're currently focused on. Be authentic and add some gentle wit.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7, // Adds some creativity while keeping it coherent
    });

    const summary = completion.choices[0]?.message?.content || 'Unable to generate summary at this time.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
