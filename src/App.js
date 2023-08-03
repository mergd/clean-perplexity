import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [text, setText] = useState("");

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(removeCitations(clipboardText));
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const removeCitations = (text) => {
    // remove bracketed citations
    let newText = text.replace(/\[\d+\]/g, "");

    // remove "Citations:" section
    const citationIndex = newText.indexOf("Citations:");
    if (citationIndex !== -1) {
      newText = newText.substring(0, citationIndex);
    }

    return newText;
  };

  return (
    <div className="container">
      <h1 className="title">Remove Citations from Perplexity Output</h1>
      <button className="button" onClick={handlePaste}>
        Paste from Clipboard
      </button>

      <textarea
        className="textarea"
        placeholder="Paste text here"
        value={text}
        onChange={(e) => setText(removeCitations(e.target.value))}
      />
    </div>
  );
};

export default App;
