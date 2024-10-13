"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (event.target && typeof event.target.result === 'string') {
        setImage(event.target.result);
        
        // Get base64 string without the data:image/xxx;base64, prefix
        const base64String = event.target.result.split(',')[1];

        try {
          console.log('Sending request to API');
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64_image: base64String })
          });

          console.log('Response status:', response.status);

          if (response.ok) {
            console.log('Analysis successful');
            const { data } = await response.json();
            console.log(data);
            setAnalysisResult(data.choices[0].message.content);
            console.log('Analysis result:', data);
          } else {
            console.error('Analysis failed', await response.text());
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Uploader</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the image here ...</p>
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
      </div>
      {image && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Uploaded Image:</h2>
          <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      )}
      {analysisResult && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;