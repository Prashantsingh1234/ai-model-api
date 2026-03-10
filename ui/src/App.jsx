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
      const res = await fetch("http://82.25.104.12:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          max_tokens: maxTokens,
        }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("Error generating response");
    }

    setLoading(false);
  };

  return (
    <>
      {/* 🔮 GLOBAL STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: Inter, system-ui, -apple-system;
        }

        body {
          margin: 0;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, #6366f1, #020617 40%),
            radial-gradient(circle at bottom right, #22d3ee, #020617 40%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #e5e7eb;
        }

        .app {
          width: 900px;
          max-width: 95%;
          padding: 40px;
          border-radius: 20px;
          background: rgba(2, 6, 23, 0.7);
          backdrop-filter: blur(18px);
          box-shadow: 0 0 60px rgba(99, 102, 241, 0.35);
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2.2rem;
          background: linear-gradient(90deg, #22d3ee, #818cf8, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        textarea {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(2, 6, 23, 0.8);
          color: #f8fafc;
          resize: none;
          outline: none;
          transition: 0.3s;
        }

        textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 15px rgba(56,189,248,0.4);
        }

        .controls {
          margin-top: 20px;
        }

        .slider {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }

        input[type="range"] {
          flex: 1;
          accent-color: #6366f1;
        }

        .token {
          min-width: 50px;
          text-align: center;
          font-weight: 600;
          color: #38bdf8;
        }

        button {
          margin-top: 30px;
          width: 100%;
          padding: 16px;
          font-size: 17px;
          font-weight: 700;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          color: #020617;
          background: linear-gradient(135deg, #22d3ee, #818cf8, #f472b6);
          background-size: 200% 200%;
          animation: gradientMove 4s ease infinite;
          transition: transform 0.2s;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        button:hover {
          transform: translateY(-2px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading {
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 rgba(99,102,241,0.6); }
          50% { box-shadow: 0 0 30px rgba(99,102,241,0.9); }
          100% { box-shadow: 0 0 0 rgba(99,102,241,0.6); }
        }

        .response {
          margin-top: 35px;
          animation: fadeIn 0.5s ease;
        }

        pre {
          margin-top: 10px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(2,6,23,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          white-space: pre-wrap;
          line-height: 1.7;
        }
      `}</style>

      {/* 🧠 APP */}
      <div className="app">
        <h1>✨ Fine-Tuned LLM Playground</h1>

        <textarea
          rows="6"
          placeholder="Ask your model anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="controls">
          <label>Max Tokens</label>
          <div className="slider">
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
            />
            <div className="token">{maxTokens}</div>
          </div>
        </div>

        <button
          onClick={generateText}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "✨ Generating..." : "🚀 Generate Response"}
        </button>

        {response && (
          <div className="response">
            <h3>🧠 Model Output</h3>
            <pre>{response}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
