"use client";

import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../util/analyzeImage';
import { createRecipes } from '../util/createRecipes';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  setAnalysisResult: React.Dispatch<React.SetStateAction<string | null>>;
  setRecipeResult: React.Dispatch<React.SetStateAction<string | null>>;
}

// Component for uploading images, and calling the OpenAI API on the image
const ImageUploader: React.FC<ImageUploaderProps> = ({ setAnalysisResult, setRecipeResult }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [recipeLoading, setRecipeLoading] = useState<boolean>(false);

  // use react-dropzone to handle file uploads
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === 'string') {
        // store image in state for display
        setImage(event.target.result);
        setAnalysisResult(null);
        setRecipeResult(null);
        setAnalysisLoading(true);
        
        // Get base64 string without the data:image/xxx;base64, prefix
        const base64String = event.target.result.split(',')[1];

        // Call OpenAI API to analyze image for its contents
        analyzeImage(base64String).then((result) => {
          setAnalysisResult(result);
          setAnalysisLoading(false);

          // If we get a result, call OpenAI API to generate recipes
          if (result !== 'Error: No food or ingredients found.') {
            setRecipeLoading(true);
            console.log('Creating recipes...');
            createRecipes(result).then((result) => {
              console.log("recipes generated")
              setRecipeLoading(false);
              setRecipeResult(result);
            });
          }
          else {
            setRecipeResult(null);
          }
        });
      }
    };

    reader.readAsDataURL(file);
  }, [setAnalysisResult, setRecipeResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-blue-600 font-bold mb-4">Image Uploader</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the image here ...</p>
        ) : (
          <p className='text-blue-500'>Drag and drop an image here, or click to select a file</p>
        )}
      </div>
      {/* Display image if it has been uploaded */}
      {image && (
        <div className="mt-8">
          <h2 className="text-xl text-blue-600 font-semibold mb-2">Uploaded Image:</h2>
          <div className="mt-8 flex items-center justify-center flex-col">
            <img src={image} alt="Uploaded" className="max-h-[50vh] rounded-lg shadow-lg" />
          </div>
        </div>
      )}
      {/* Display loading icons if we are calling the OpenAI API (for analysis and recipes) */}
      {analysisLoading && (
        <div className="flex justify-center items-center flex-col mt-10">
          <h2 className="text-xl text-blue-600 font-semibold mb-2">Generating Analysis...</h2>
          <Loader2 className="w-24 h-24 animate-spin text-primary text-blue-400" />
        </div>
      )}
      {recipeLoading && (
        <div className="flex justify-center items-center flex-col mt-10">
          <h2 className="text-xl text-blue-600 font-semibold mb-2">Generating Recipes Based on Analysis...</h2>
          <Loader2 className="w-24 h-24 animate-spin text-primary text-blue-400" />
        </div>
      )}

    </div>
  );
};

export default ImageUploader;