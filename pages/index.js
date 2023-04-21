import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [uploadedPDF, setPDFInput] = useState("")
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {

      const formData = new FormData();
      formData.append("question", questionInput);
      formData.append("resume", uploadedPDF);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, resume: uploadedPDF }),
        
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionInput("");
      setLoading(false);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
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
          <p>Paste your resume from LinkedIn below:</p>
          <input 
            className={styles.resumeInput}
            type="text"
            name="resume"
            placeholder="Paste resume here"
            value={uploadedPDF}
            onChange={(e) => setPDFInput(e.target.value)}
            />
          <p>Ask for any career guidance below:</p>
          <input
            className={styles.questionBox}
            type="text"
            name="question"
            placeholder="Enter question here"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" value="Get Response!" />
        </form>
        <div className={styles.responseBox}>
          <div className={styles.result}>
            <div className={styles.resumAI}>ResumAI:</div>
            {result}
          </div>
        </div>
      </main>
    </div>
  );
}

