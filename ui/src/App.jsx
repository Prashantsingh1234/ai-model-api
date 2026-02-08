import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [maxTokens, setMaxTokens] = useState(100);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://82.25.104.12/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: maxTokens,
        }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse("Error generating response");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Fine-Tuned LLM Demo</h1>

      <textarea
        rows="6"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <label>Max Tokens:</label>
        <input
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          style={{ marginLeft: "10px", width: "80px" }}
        />
      </div>

      <button
        onClick={generateText}
        disabled={loading}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {response && (
        <div style={{ marginTop: "30px" }}>
          <h3>Response:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              whiteSpace: "pre-wrap",
            }}
          >
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
