import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  // const [uploadedPDF, setPDFInput] = useState("")
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput }),
        // body: JSON.stringify({ resume: uploadedPDF}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>ResumAI</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>Here to help you with your career!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter Question Here"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          {/* <input 
            type="file"
            name="resume"
            placeholder="upload pdf here"
            value={uploadedPDF}
            onChange={(e) => setPDFInput(e.target.value)}
            /> */}
          <input type="submit" value="Get answer to your question" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
