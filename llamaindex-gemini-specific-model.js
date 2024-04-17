// Load environment variables from .env file
require("dotenv").config();
console.log(process.env.GEMINI_API_KEY);

//
const {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
} = require("llamaindex");

const { GoogleGenerativeAI } = require("@google/generative-ai");
//
async function main() {
  // 1. Retrieval (load documents from directory)
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: "./data",
  });

  // 2. Create VectorStoreIndex for retrieval
  const index = await VectorStoreIndex.fromDocuments(documents);

  // 3. Create query engine for information retrieval
  const queryEngine = index.asQueryEngine();

  // 4. User query for information retrieval
  const response = await queryEngine.query({
    query: "What is the estimated population of the Earth?",
  });

  // 5. Retrieved information (assuming relevant passage)
  const retrievedInfo = response.toString();

  // 6. Custom LLM configuration (using Gemini integration)
  // const customLLM = new GoogleGenerativeAI({
  //   apiKey: process.env.GEMINI_API_KEY,
  // });

  const customLLM = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 7. Prompt construction (augmentation with retrieved info)
  let prompt = "Write a short story about "; // Replace with generic prompt

  // **Augmentation approach:**
  prompt += retrievedInfo + ". "; // Add retrieved information for context

  // OR (alternative approach)op

  // **Conditioning approach (optional):**
  // if (retrievedInfo.includes("computer science")) {
  //   prompt += "a computer science student. ";
  // } else {
  //   prompt += "... "; // Add generic continuation
  // }

  // 8. Text generation using Gemini

  //const generatedText = await customLLM.generateContent(prompt);
  //victor modification
  // utilizes the getGenerativeModel function
  // to explicitly request the "gemini-pro" model. 
  const model = customLLM.getGenerativeModel({ model: "gemini-pro" });
  //const generatedText = await model.generateContent(prompt);
  // get result is an object that contains the response and other metadata
  const result = await model.generateContent(prompt);
  // get the response from the result object
  const generatedResponse = await result.response;
  const generatedText = generatedResponse.text();

  // 9. Output response
  console.log("Retrieved information:");
  console.log(retrievedInfo);
  console.log("\nGenerated story:");
  console.log(generatedText);
}

main();
