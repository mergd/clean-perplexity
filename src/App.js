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
    return removePatternFromStringWithCode(text);
  };
  function removePatternFromStringWithNoCode(notCodeString) {
    return notCodeString.replace(/\s*\[\d+\]\s*/g, "");
  }

  function removePatternFromStringWithCode(stringWithCode) {
    // remove any text after the "Citations:" section
    const citationsEndIndex = stringWithCode.indexOf("Citations:");
    if (citationsEndIndex !== -1) {
      stringWithCode = stringWithCode.substring(0, citationsEndIndex);
    }
    const multilineCodePattern = /(```.+?```)/s;
    const singlelineCodePattern = /(`.+?`)/s;
    const chunks = stringWithCode.split(multilineCodePattern);
    for (let i = 0; i < chunks.length; i += 2) {
      const subChunks = chunks[i].split(singlelineCodePattern);

      for (let j = 0; j < subChunks.length; j += 2) {
        subChunks[j] = removePatternFromStringWithNoCode(subChunks[j]);
        chunks[i] = subChunks.join("");
      }
    }

    return chunks.join("");
  }

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
