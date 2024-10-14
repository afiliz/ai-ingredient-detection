// Calls OpenAI API to create recipes based on the analysis result. If there is an error, it will throw an error in console output
export async function createRecipes(analysisResult: string) {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },   
    body: JSON.stringify({ analysisResult: analysisResult })
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Recipe generation failed, see console output for details.');
  }

  console.log('Recipe generation successful');
  const { data } = await response.json();

  console.log('Recipe generation result:', data);
  return data.choices[0].message.content;
}
