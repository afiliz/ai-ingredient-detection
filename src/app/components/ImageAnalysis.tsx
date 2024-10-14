interface ImageAnalysisProps {
  analysisResult: string;
  recipeResult: string | null;
}

export default function ImageAnalysis({ analysisResult, recipeResult }: ImageAnalysisProps) {
  return (
    // Display the analysis result after formatting it
    <div className="container mx-auto p-4">
      <h2 className="text-xl text-blue-600 font-semibold mb-2">Analysis Result</h2>
      <h3 className="text-md text-blue-500 mb-2">This is what we found in your image.</h3>
      <div className="whitespace-pre-wrap">{foodListToJSX(analysisResult)}</div>

      {/* if we have a recipe result in the state, display it */}
      {recipeResult && (
        <div className="mt-6">
          <h2 className="text-xl text-blue-600 font-semibold mb-2">Recipe Results</h2>
          <h3 className="text-md text-blue-500 mb-2">Here are some recipes based on your ingredients!</h3>
          <div className="whitespace-pre-wrap">{recipeListToJSX(recipeResult)}</div>
        </div>
      )}
    </div>
  );
}

interface FoodItem {
  food: string;
  value: string;
}

const foodListToJSX = (input: string): JSX.Element[] => {
  // If we don't any food results, return an error
  if (!input || input === 'Error: No food or ingredients found.') {
    return [<div key="0" className="text-red-500 font-bold">No food or ingredients found.</div>];
  }

  // Parse each line into a FoodItem
  const lines = input.split('\n');
  const foodItems: FoodItem[] = lines.map(line => {
    const [food, value] = line.split(',').map(item => item.trim());
    return { food, value };
  });

  return foodItems.map((item, index) => (
    <div key={index}>
      <span className="text-black font-bold capitalize">{item.food}</span>: {<span className="text-black">{item.value}</span>}
    </div>
  ));
};

interface Recipe {
  name: string;
  description: string;
}

const recipeListToJSX = (input: string): JSX.Element[] => {
  // Split the input string into recipe lines
  const recipeLines = input.split('\n');

  // Parse each line into a Recipe object
  const recipes: Recipe[] = recipeLines.map(line => {
    const [name, description] = line.split(':').map(part => part.trim());
    return { name, description };
  });

  // Generate JSX for each recipe
  return recipes.map((recipe, index) => (
    <div key={index} className="recipe mb-4">
      <h2 className="text-black font-bold">{recipe.name}</h2>
      <p className="text-black">{recipe.description}</p>
    </div>
  ));
};