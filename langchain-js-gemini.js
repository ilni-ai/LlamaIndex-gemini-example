require("dotenv").config();
console.log(process.env.GEMINI_API_KEY);

const { LocalDocumentStore, LangChain } = require("langchain");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
  // 1. Set up document store (loading documents from directory)
  const documentStore = new LocalDocumentStore({
    directoryPath: "./data"
  });
  await documentStore.initialize();

  // 2. Initialize LangChain with the document store
  const langChain = new LangChain({
    documentStore: documentStore,
    retrievalMethod: "sparse", // Assuming sparse retrieval; adjust as needed
  });

  // 3. User query for information retrieval
  const query = "What is the estimated population of the Earth?";
  const retrievedDocs = await langChain.retrieval.query(query);

  // 4. Handle retrieved documents (assuming relevant content is returned)
  const retrievedInfo = retrievedDocs.map(doc => doc.content).join(" ");

  // 5. Custom LLM configuration (using Gemini integration)
  const customLLM = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 6. Prompt construction (augmentation with retrieved info)
  let prompt = "Write a short story about ";
  prompt += retrievedInfo + ". ";

  // 7. Text generation using Gemini
  const model = customLLM.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const generatedText = result.text;

  // 8. Output response
  console.log("Retrieved information:");
  console.log(retrievedInfo);
  console.log("\nGenerated story:");
  console.log(generatedText);
}

main();
