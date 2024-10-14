// Calls OpenAI API to analyze a given base64 image for its contents. If there is an error, it will throw an error in console output
export async function analyzeImage(base64String: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },   
    body: JSON.stringify({ base64_image: base64String })
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Analysis failed, see console output for details.');
  }

  console.log('Analysis successful');
  const { data } = await response.json();

  console.log('Analysis result:', data);
  return data.choices[0].message.content;
}
