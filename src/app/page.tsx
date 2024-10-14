"use client";

import ImageUploader from "./components/ImageUploader";
import ImageAnalysis from "./components/ImageAnalysis";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [recipeResult, setRecipeResult] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex-col items-center">
      <div className="max-w-2xl mx-auto bg-white p-8 md:mt-10 md:rounded-xl shadow-lg relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-600">
          Food Ingredient Detector 🕵️‍♂️🍽️
        </h1>
        
        <div className="relative">
          <div className="bg-blue-50 border-blue-200 border p-4 rounded-lg">
            <div className="text-blue-700 flex items-center">
              How it works
              <div className="relative inline-block ml-2">
                <HelpCircle 
                  size={20}
                  className="text-blue-500 cursor-help" 
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute z-10 w-64 p-2 -mt-2 text-sm leading-tight text-white bg-slate-800 rounded-lg shadow-lg">
                    <img 
                      src="/fridge_example.jpg" 
                      alt="Example fridge interior" 
                      className="w-full h-auto rounded-lg mb-2"
                    />
                    <p>This is an example of a good picture of food and ingredients (inside a fridge). Your image should look similar to this.</p>
                    <p>If you get the error &#x0022;Error: No food or ingredients found.&#x0022;, try re-uploading your image.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="text-blue-600">
              Upload a photo of your foods and/or ingredients, and we will detect them and generate some recipes!
            </div>
          </div>
        </div>
        <div>
          <ImageUploader setAnalysisResult={setAnalysisResult} setRecipeResult={setRecipeResult}/>
          {analysisResult && <ImageAnalysis analysisResult={analysisResult} recipeResult={recipeResult}/>}
        </div>
      </div>

      
    </main>
  );
}
