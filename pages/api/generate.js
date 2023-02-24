import { Configuration, OpenAIApi } from "openai";

// const fs = require('fs');
// const pdf = require('pdf-parse');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const dataBuffer = fs.readFileSync(req.body.resume);
// pdf(dataBuffer).then(data => {
//   const pdfText = data.text;

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  // const dataBuffer = fs.readFileSync(req.body.resume);
  // pdf(dataBuffer).then(data => {
  //   const pdfText = data.text;

  // const resume = req.body.resume || '';
  // if (question.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid pdf of your resume",
  //     }
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question), //+ pdfText,
      temperature: 0.6,
      max_tokens: 256
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question) {
  const capitalizedQuestion =
    question[0].toUpperCase() + question.slice(1).toLowerCase();
    return `Answer as a helpful, friendly, happy career advisor.
    
    Question: ${capitalizedQuestion}
    Answer:`;
//   return `Suggest three names for an animal that is a superhero.

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
}
