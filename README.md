## Introduction
[Live Link to Project](https://ai-ingredient-detection.vercel.app/)

This is a web application that detects what foods/ingredients are present in uploaded images. Additionally, it will generate some recipes that you can make using the ingredients and foods found in the image.

## Features
- Image uploading: Allows user to upload images (.png, .jpeg", .jpg .webp)
- Image analysis through ChatGPT-4o mini
- Recipe generation via ChatGPT-4o mini
- Tooltip (the ? icon in the app intro) to allow users to see a good example of an image to use for uploading
- Error handling: Correctly throws an error if the uploaded image doesn't contain food or ingredients
- Responsive CSS: UI is accessible on all devices (desktop, tablet, and mobile)

## Tech Stack

Below are the technologies I used, as well as the reasons I chose those technologies.
- React: Very flexible library for manipulating the DOM. It is also widely used in the development community and has fantastic documentation.
- Next.js: Provides optimized rendering with client and server-side components, and API routes via its App router. Also makes it simple to deploy to Vercel. 
- Tailwind CSS: Makes it easier to edit the CSS of elements directly in the HTML, and removes the need for additional CSS files.
- ChatGPT
  - When choosing an AI model to use, I considered both OpenAI's ChatGPT and Anthropic's Claude. Both offered robust vision capabilities, but in the end I went with ChatGPT.
  - [As detailed in ChatGPT's docs,](https://platform.openai.com/docs/guides/vision) ChatGPT's vision capabilities can be controlled based on low or high fidelity image understanding. Meaning, you can choose to use "low" or "high" detailed image modes when using the vision API. Low detail mode uses fewer tokens and faster responses at the cost of less detailed responses, while high detail uses more tokens for better responses. For the purposes of this project, I left the mode on "auto", which lets ChatGPT decide which mode to use. However, if this project had a larger scope (say with a user count in the thousands), the option to control using low or high detail would be very valuable in controlling costs.
  - Claude's vision capabilites were also impressive during my testing of its API, but it doesn't have the same control over fidelity in image understanding.
  - I chose GPT-4o mini as the ChatGPT model as it was the recommended model by OpenAI for vision capabilities, mainly for its balance of performance and cost, where it achieves [results close to 4o at a better price-point](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/).
- Vercel: Platform that makes deploying apps simple (straight from your GitHub repo) while offering control over the process.
- react-dropzone: Simplifies uploading images in React.

Additionally, here is my approach when generating prompts in requests to ChatGPT.
- Make sure output is formatted properly: Without specifying format of output, ChatGPT can change the formatting of its responses (ex: displaying ingredients separated by new lines, commas, etc). I made sure to include format details in my prompts, ideally in formats that could be processed after getting the responses (ex: asked for ingredient/ingredient counts in csv format for easier post-processing).
- In prompt engineering it is recommended to tell the AI to act as if it were an expert on the subject at hand. In this case, I asked it to be an expert on food and ingredients for image analysis, and an expert on food for recipe generation.
- In providing images to ChatGPT, you have 2 options: provide a url to the image, or provide it as a 64base string. I chose the latter to skip the step of uploading it to an external service, which would have complicated the tech stack and caused additional delay before generating results. If I did need to use the first option, I would have uploaded the image to Amazon S3 or a similar file hosting service, and provided the url of that uploaded image.

## Challenges faced
- ChatGPT doesn't always detect ingredients or food
  - During development, I tested my inputs to ChatGPT with various images, including images of the inside of fridges, fruits on a table, and various images not including food at all. I've found that ChatGPT will sometimes not detect food or ingredients even if they are clearly present. As I asked ChatGPT to respond with "Error: No food or ingredients found" if no food/ingredients are found, this would cause that output even when food is clearly present in the uploaded image. I improved ChatGPT's results regarding this by using stronger language with my prompts to only respond with that phrase if there is absolutely no food or ingredients in the image.
- Modularizing code
  - As I wanted to make my code as modular as possible (in the case this app is developed further in the future), I wanted to make sure I could display output in a server component to improve rendering speeds. When I started the project, all of the API calls and elements displaying the output was in one component. I spent some time refactoring this code to make sure the component ImageUploader focused on uploading the image and making API calls as a client component, and ImageAnalysis focused on rendering that output and doing post-processing in a server component.
