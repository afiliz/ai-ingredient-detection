import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { base64_image} = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  // Take the base64 image and analyze it, making sure we get the result in csv format. Need to be very specific with the prompt as ChatGPT sometimes responds with the wrong format
  const body = JSON.stringify({
    messages: [
      { role: 'system', content: "You are an expert on food and food ingredients. You can only respond with the following format: Render the output (ingredients and quantities) in csv file format, without headers or footers. Make certain to remove headers or footers like ```csv: or ```:" },
      { role: 'user', content: 
        [
          { type: 'text', text: "List all the ingredients you see in the image, along with their quantities. If the image absolutely does not have any food or ingredients at all, respond with: Error: No food or ingredients found." },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${base64_image}`
            }
          }
        ]
      }],
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
