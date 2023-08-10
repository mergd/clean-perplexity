import React, { useState } from "react";
import { FaCopy, FaPaste, FaTrash } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [text, setText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(removeCitations(clipboardText));
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setText("");
  };

  const removeCitations = (text) => {
    // remove bracketed citations outside of code blocks
    let newText = text.replace(/(?<!`)((?<!\w)\[\d+\](?!\w))/g, "");

    // remove "Citations:" section outside of code blocks
    const citationIndex = newText.indexOf("Citations:");
    if (citationIndex !== -1) {
      newText = newText.substring(0, citationIndex);
    }

    // remove bracketed citations inside of code blocks
    newText = newText.replace(/`[^`]*`|\n```[\s\S]*?\n```/g, (match) => {
      if (match.startsWith("`")) {
        return match;
      } else {
        return match.replace(/(?<!`)((?<!\w)\[\d+\](?!\w))/g, "");
      }
    });

    return newText;
  };
  return (
    <div className="container">
      <h2 className="title">Remove Citations from Perplexity Output</h2>
      <div className="button-container">
        <button className="button" onClick={handlePaste}>
          <FaPaste className="icon" />
          Paste
        </button>
        <button className="button" onClick={handleCopy} disabled={!text.trim()}>
          <FaCopy className="icon" />
          Copy
        </button>
        <button
          className="button"
          onClick={handleClear}
          disabled={!text.trim()}
        >
          <FaTrash className="icon" />
        </button>
      </div>
      <textarea
        className="textarea"
        placeholder="Paste text here"
        value={text}
        onChange={(e) => setText(removeCitations(e.target.value))}
      />
      {showToast && <div className="toast">Copied!</div>}
    </div>
  );
};

export default App;
