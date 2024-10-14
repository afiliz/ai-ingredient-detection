import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { analysisResult } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  // Given the analysis result, call OpenAI API to generate recipes. Output should be broken by new lines
  const body = JSON.stringify({
    messages: [
      { role: 'system', content: "You are a food expert. You can only respond with the following format:  Render the output where each recipe name/recipe description pair is separated by a new line, and recipe name and recipe description are separated by a colon." },
      { role: 'user', content: "Given the following ingredients and quantities, come up with at least 1 recipe and a max of 5 recipes using the ingredients and/or foods. " + analysisResult },
    ],
    model: 'gpt-4o-mini',
    max_tokens: 300
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body
    });
    const data = await response.json();
    return NextResponse.json({ data: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  } 
}
