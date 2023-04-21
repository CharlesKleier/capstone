import { Configuration, OpenAIApi } from "openai";

const fs = require('fs');
// const pdf = require('pdf-parse');
// const Tesseract = require('tesseract.js');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


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

  const resume = req.body.resume || '';
  if (resume.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid pdf of your resume",
      }
    });
    return;
  }

// davinci api

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question, resume),
      temperature: 0.6,
      max_tokens: 500
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

// gpt-3.5-turbo
//   try {
//     const completion = await openai.createCompletion({
//       id: 'chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve',
//       object: 'chat.completion',
//       created: 167764942,
//       model: 'gpt-3.5-turbo',
//       usage: {'prompt_tokens': 56, 'completion_tokens': 31, 'total_tokens': 87},
//       choices: [
//         {
//         message: {
//           role: 'assistant',
//           content: generatePrompt(question, resume)},
//         finish_reason: 'stop',
//         index: 0
//         }
//       ]
//     });
//   } catch(error) {
//         // Consider adjusting the error handling logic for your use case
//         if (error.response) {
//           console.error(error.response.status, error.response.data);
//           res.status(error.response.status).json(error.response.data);
//         } else {
//           console.error(`Error with OpenAI API request: ${error.message}`);
//           res.status(500).json({
//             error: {
//               message: 'An error occurred during your request.',
//             }
//           });
//         }
//       }
// }




function generatePrompt(question, resume) {
  const capitalizedQuestion =
    question[0].toUpperCase() + question.slice(1).toLowerCase();
  const resumePrompt =
    resume[0].toUpperCase() + resume.slice(1).toLowerCase();
    return `You are a career advisor named resumAI. 
    helpful, friendly, personable 
    Also use the resume to personalize the answer to the questions.
    
    resume: ${resumePrompt}
    Question: ${capitalizedQuestion}
    Answer:`;
}
