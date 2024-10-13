import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("test");
  const { base64_image} = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = JSON.stringify({
    messages: [{ role: 'user', content: 
      [
        { type: 'text', text: "Act as if you're a food expert. If the image is not an image of the inside of a fridge with food and/or ingredients inside, respond with: No food or ingredients found. Otherwise, list the ingredients found in the image, along with their quantities. Render the output as a list without markdown and with new lines between each ingredient." },
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
